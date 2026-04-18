export const runtime = 'edge'

const tables = [
  { id: 'T1', capacity: 2, location: 'Window', status: 'Available' },
  { id: 'T2', capacity: 2, location: 'Indoor', status: 'Occupied' },
  { id: 'T3', capacity: 4, location: 'Indoor', status: 'Available' },
  { id: 'T4', capacity: 4, location: 'Outdoor', status: 'Reserved' },
  { id: 'T5', capacity: 6, location: 'Indoor', status: 'Available' },
  { id: 'T6', capacity: 6, location: 'Outdoor', status: 'Available' },
  { id: 'T7', capacity: 2, location: 'Window', status: 'Available' },
  { id: 'T8', capacity: 8, location: 'Private Room', status: 'Available' },
]

export async function GET() {
  return Response.json({ tables })
}

export async function POST(request) {
  const table = await request.json()
  return Response.json({ success: true, table })
}
