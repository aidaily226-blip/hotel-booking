export const runtime = 'edge'

const dishes = [
  { id: 'D01', name: 'Butter Chicken', category: 'Main Course', price: 320, veg: false, available: true },
  { id: 'D02', name: 'Paneer Tikka Masala', category: 'Main Course', price: 280, veg: true, available: true },
  { id: 'D03', name: 'Garlic Naan', category: 'Breads', price: 60, veg: true, available: true },
  { id: 'D04', name: 'Caesar Salad', category: 'Starters', price: 180, veg: true, available: true },
  { id: 'D05', name: 'Seekh Kebab', category: 'Starters', price: 350, veg: false, available: false },
  { id: 'D06', name: 'Gulab Jamun', category: 'Desserts', price: 120, veg: true, available: true },
]

export async function GET() {
  return Response.json({ dishes })
}

export async function POST(request) {
  const dish = await request.json()
  return Response.json({ success: true, dish })
}
