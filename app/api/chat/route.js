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

// ── Fetch existing bookings from Google Sheets ──
async function getExistingBookings() {
  try {
    const token = await getAccessToken()
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Bookings!A2:H100`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    const rows = data.values || []
    return rows.map(row => ({
      id: row[0],
      guest: row[1],
      phone: row[2],
      table: row[3],
      date: row[4],
      time: row[5],
      guests: parseInt(row[6]) || 0,
      status: row[7],
    }))
  } catch {
    return []
  }
}

// ── Check if table is available at given date/time ──
function isTableAvailable(bookings, tableId, date, time) {
  return !bookings.some(b =>
    b.table === tableId &&
    b.date === date &&
    b.time === time &&
    b.status !== 'Cancelled'
  )
}

// ── Find best available table for guest count ──
function findAvailableTable(tables, bookings, guestCount, date, time) {
  // Filter tables that fit guest count and are not booked at that time
  const suitable = tables.filter(t =>
    t.capacity >= guestCount &&
    isTableAvailable(bookings, t.id, date, time)
  )
  // Sort by smallest capacity that fits (best fit)
  suitable.sort((a, b) => a.capacity - b.capacity)
  return suitable[0] || null
}


// ── Fetch admin instructions from Google Sheets ──
async function fetchAdminInstructions() {
  try {
    const token = await getAccessToken()
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Settings!A2:B2`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    const rows = data.values || []
    return rows[0]?.[1] || ''
  } catch {
    return ''
  }
}

export async function POST(request) {
  try {
    const { message, history } = await request.json()

    // ── Fetch live data ──
    const [existingBookings, adminInstructions] = await Promise.all([
      getExistingBookings(),
      fetchAdminInstructions(),
    ])
    const restaurantData = getRestaurantData()

    // ── Build availability summary for AI ──
    const availabilityNote = `
IMPORTANT - EXISTING BOOKINGS (check these before booking a table):
${existingBookings.length === 0 ? 'No existing bookings yet.' : existingBookings.map(b =>
  `Table ${b.table} is ALREADY BOOKED on ${b.date} at ${b.time} for ${b.guests} guests`
).join('\n')}

AVAILABLE TABLES RIGHT NOW:
${restaurantData.tables.map(t => {
  const bookedSlots = existingBookings
    .filter(b => b.table === t.id && b.status !== 'Cancelled')
    .map(b => `${b.date} at ${b.time}`)
  return `${t.id} (${t.capacity} seats, ${t.location})${bookedSlots.length > 0 ? ` - BOOKED at: ${bookedSlots.join(', ')}` : ' - Currently free'}`
}).join('\n')}
`

    const systemPrompt = `
You are a friendly AI assistant for ${restaurantData.name} restaurant.
Help customers explore the menu and book tables.

RESTAURANT INFO:
${JSON.stringify(restaurantData, null, 2)}

${availabilityNote}

ADMIN SPECIAL INSTRUCTIONS (follow these strictly):
${adminInstructions ? adminInstructions : 'No special instructions set.'}

BOOKING RULES:
- NEVER book a table that is already booked at the same date AND time
- If requested table/time is taken, suggest the next available table or different time
- For booking, collect: date, time, number of guests, customer name, phone number
- Choose the best available table based on guest count (smallest table that fits)
- Once you have ALL details confirmed by customer, end reply with this EXACT format on a new line:
  BOOKING_CONFIRMED:{"guest":"name","phone":"number","table":"T3","date":"2026-04-20","time":"7:00 PM","guests":4}
- Always show prices in Indian Rupees (₹)
- Keep responses short and conversational
- Use emojis 🍽️
`

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_AI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: message },
          ],
          max_tokens: 600,
        }),
      }
    )

    const data = await response.json()
    let reply = data.result?.response || "Sorry, I couldn't process that. Please try again!"

    // ── Detect booking and validate it ──
    let booking = null
    if (reply.includes('BOOKING_CONFIRMED:')) {
      try {
        const jsonStr = reply.split('BOOKING_CONFIRMED:')[1].split('\n')[0].trim()
        const parsed = JSON.parse(jsonStr)

        // ── Double check table availability ──
        if (!isTableAvailable(existingBookings, parsed.table, parsed.date, parsed.time)) {
          // Find another available table
          const alternative = findAvailableTable(
            restaurantData.tables,
            existingBookings,
            parsed.guests,
            parsed.date,
            parsed.time
          )

          if (alternative) {
            parsed.table = alternative.id
            booking = { ...parsed, id: `BK${Date.now()}`, status: 'Confirmed', isNew: true }
            reply = reply.split('BOOKING_CONFIRMED:')[0].trim()
            reply += `\n\n⚠️ The originally requested table was taken, so I've assigned you **Table ${alternative.id}** (${alternative.capacity} seats, ${alternative.location}) instead at the same date and time.`
          } else {
            // No tables available at that time
            booking = null
            reply = reply.split('BOOKING_CONFIRMED:')[0].trim()
            reply += `\n\n😔 Sorry, no tables are available on ${parsed.date} at ${parsed.time}. Would you like to try a different time?`
          }
        } else {
          booking = { ...parsed, id: `BK${Date.now()}`, status: 'Confirmed', isNew: true }
          reply = reply.split('BOOKING_CONFIRMED:')[0].trim()
        }
      } catch (e) {
        // JSON parse failed
      }
    }

    return Response.json({ reply, booking })

  } catch (error) {
    return Response.json({ reply: "Sorry, I'm having trouble right now. Please try again!" }, { status: 500 })
  }
}

function getRestaurantData() {
  return {
    name: 'Spice Garden',
    address: '123 Food Street, Mumbai',
    phone: '+91 98765 43210',
    openingHours: '12:00 PM - 11:00 PM',
    dishes: [
      { name: 'Butter Chicken', category: 'Main Course', price: 320, veg: false, available: true },
      { name: 'Paneer Tikka Masala', category: 'Main Course', price: 280, veg: true, available: true },
      { name: 'Garlic Naan', category: 'Breads', price: 60, veg: true, available: true },
      { name: 'Caesar Salad', category: 'Starters', price: 180, veg: true, available: true },
      { name: 'Seekh Kebab', category: 'Starters', price: 350, veg: false, available: false },
      { name: 'Gulab Jamun', category: 'Desserts', price: 120, veg: true, available: true },
      { name: 'Chicken Biryani', category: 'Rice & Biryani', price: 380, veg: false, available: true },
      { name: 'Dal Makhani', category: 'Main Course', price: 220, veg: true, available: true },
    ],
    tables: [
      { id: 'T1', capacity: 2, location: 'Window' },
      { id: 'T2', capacity: 2, location: 'Indoor' },
      { id: 'T3', capacity: 4, location: 'Indoor' },
      { id: 'T4', capacity: 4, location: 'Outdoor' },
      { id: 'T5', capacity: 6, location: 'Indoor' },
      { id: 'T6', capacity: 6, location: 'Outdoor' },
      { id: 'T7', capacity: 2, location: 'Window' },
      { id: 'T8', capacity: 8, location: 'Private Room' },
    ],
    policies: {
      reservation: 'Tables can be booked up to 7 days in advance',
      cancellation: 'Free cancellation up to 2 hours before reservation',
      groupDiscount: '10% off for groups of 8 or more',
    }
  }
}
// This file already has getAccessToken — settings fetch added below
