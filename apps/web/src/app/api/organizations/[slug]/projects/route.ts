import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const awaitedParams = await params
  const { slug } = awaitedParams

  const backendUrl = `http://localhost:3333/organizations/${slug}/projects`

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

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const { data } = await request.json()

  const { name, description, org } = data

  const backendUrl = `http://localhost:3333/organizations/${org}/projects`

  const res = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  })

  const text = await res.text()
  const contentType = res.headers.get('content-type') ?? 'application/json'

  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': contentType },
  })
}
