// app/api/profile/route.ts (server)
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const backendUrl = `http://localhost:3333/profile`

  const res = await fetch(backendUrl, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  })

  const text = await res.text()
  const contentType = res.headers.get('content-type') ?? 'application/json'

  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': contentType },
  })
}
