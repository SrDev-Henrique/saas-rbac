import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const id = body.id ?? request.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  try {
    const backendUrl = `${process.env.BACKEND_URL ?? 'http://localhost:3333'}/users`

    const res = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    const text = await res.text()

    if (!res.ok) {
      return NextResponse.json(
        { error: text || 'Backend error' },
        { status: res.status },
      )
    }

    const redirectUrl = new URL('/sign-in', request.url)
    const nextRes = NextResponse.redirect(redirectUrl)

    nextRes.cookies.delete('token')

    return nextRes
  } catch (err) {
    console.error('delete-user route error', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
