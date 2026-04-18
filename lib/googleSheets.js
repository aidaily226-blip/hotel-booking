// lib/googleSheets.js
// Connect to Google Sheets for persistent data storage
// TODO: Set up credentials in .env.local

import { google } from 'googleapis'

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

// ── Sheet 1: Dishes ──
// Columns: ID | Name | Category | Price | Veg | Available | Description
export async function getDishes() {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Dishes!A2:G100',
  })
  return (res.data.values || []).map(row => ({
    id: row[0], name: row[1], category: row[2],
    price: row[3], veg: row[4] === 'TRUE', available: row[5] === 'TRUE', description: row[6],
  }))
}

// ── Sheet 2: Tables ──
// Columns: ID | Capacity | Location | Status
export async function getTables() {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Tables!A2:D100',
  })
  return (res.data.values || []).map(row => ({
    id: row[0], capacity: row[1], location: row[2], status: row[3],
  }))
}

// ── Sheet 3: Bookings ──
// Columns: ID | Guest | Phone | Table | Date | Time | Guests | Status
export async function getBookings() {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Bookings!A2:H100',
  })
  return (res.data.values || []).map(row => ({
    id: row[0], guest: row[1], phone: row[2], table: row[3],
    date: row[4], time: row[5], guests: row[6], status: row[7],
  }))
}

// ── Save a new booking ──
export async function saveBooking(booking) {
  const sheets = google.sheets({ version: 'v4', auth: getAuth() })
  const id = `BK${Date.now()}`
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Bookings!A:H',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[id, booking.guest, booking.phone, booking.table, booking.date, booking.time, booking.guests, 'Confirmed']],
    },
  })
  return id
}
