export const runtime = 'edge'

export async function POST(request) {
  try {
    const { username, password } = await request.json()
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin'
    if (username === adminUsername && password === adminPassword) {
      return Response.json({ success: true })
    }
    return Response.json({ success: false }, { status: 401 })
  } catch {
    return Response.json({ success: false }, { status: 500 })
  }
}
