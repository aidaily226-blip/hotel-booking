export const runtime = 'edge'

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

// ── Get Google Access Token ──
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }
  const encode = obj => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const signingInput = `${encode(header)}.${encode(payload)}`
  const pemKey = PRIVATE_KEY.replace(/\\n/g, '\n')
  const pemBody = pemKey.replace('-----BEGIN PRIVATE KEY-----', '').replace('-----END PRIVATE KEY-----', '').replace(/\s/g, '')
  const binaryKey = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0))
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signingInput))
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const jwt = `${signingInput}.${sig}`
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })
  const tokenData = await tokenRes.json()
  return tokenData.access_token
}

// ── Fetch all existing bookings ──
async function fetchAllBookings(token) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Bookings!A2:H100`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return (data.values || []).map(row => ({
    id: row[0],
    guest: row[1],
    phone: row[2],
    table: row[3],
    date: row[4],
    time: row[5],
    guests: row[6],
    status: row[7] || 'Confirmed',
  }))
}

// ── All tables list ──
const ALL_TABLES = [
  { id: 'T1', capacity: 2, location: 'Window' },
  { id: 'T2', capacity: 2, location: 'Indoor' },
  { id: 'T3', capacity: 4, location: 'Indoor' },
  { id: 'T4', capacity: 4, location: 'Outdoor' },
  { id: 'T5', capacity: 6, location: 'Indoor' },
  { id: 'T6', capacity: 6, location: 'Outdoor' },
  { id: 'T7', capacity: 2, location: 'Window' },
  { id: 'T8', capacity: 8, location: 'Private Room' },
]

// ── Check if a table is booked at given date+time ──
function isTableBooked(bookings, tableId, date, time) {
  return bookings.some(b =>
    b.table === tableId &&
    b.date === date &&
    b.time === time &&
    b.status !== 'Cancelled'
  )
}

// ── Find next available table for guest count ──
function findNextAvailableTable(bookings, guestCount, date, time) {
  const suitable = ALL_TABLES.filter(t =>
    t.capacity >= guestCount &&
    !isTableBooked(bookings, t.id, date, time)
  )
  suitable.sort((a, b) => a.capacity - b.capacity)
  return suitable[0] || null
}

// ── GET all bookings ──
export async function GET() {
  try {
    const token = await getAccessToken()
    const bookings = await fetchAllBookings(token)
    return Response.json({ bookings })
  } catch (error) {
    return Response.json({ bookings: [], error: error.message }, { status: 500 })
  }
}

// ── POST save new booking (with conflict check) ──
export async function POST(request) {
  try {
    const booking = await request.json()
    const token = await getAccessToken()

    // ── STEP 1: Fetch all current bookings ──
    const existingBookings = await fetchAllBookings(token)

    // ── STEP 2: Check if requested table is already booked ──
    let assignedTable = booking.table
    let tableChanged = false

    if (isTableBooked(existingBookings, booking.table, booking.date, booking.time)) {
      // Find next available table
      const alternative = findNextAvailableTable(
        existingBookings,
        parseInt(booking.guests) || 2,
        booking.date,
        booking.time
      )

      if (!alternative) {
        // No tables available at all
        return Response.json({
          success: false,
          conflict: true,
          message: `No tables available on ${booking.date} at ${booking.time}. Please choose a different time.`,
        }, { status: 409 })
      }

      assignedTable = alternative.id
      tableChanged = true
    }

    // ── STEP 3: Save to Google Sheets ──
    const id = `BK${Date.now()}`
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Bookings!A:I:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[
            id,
            booking.guest || '',
            booking.phone || '',
            assignedTable,
            booking.date || '',
            booking.time || '',
            booking.guests || '',
            'Confirmed',
            'true',
          ]],
        }),
      }
    )

    return Response.json({
      success: true,
      tableChanged,
      originalTable: booking.table,
      assignedTable,
      booking: {
        ...booking,
        id,
        table: assignedTable,
        status: 'Confirmed',
        isNew: true,
      },
    })

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
