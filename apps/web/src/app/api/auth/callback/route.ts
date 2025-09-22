import { signInWithGitHub } from '@/http/sign-in-with-github'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Code is missing' }, { status: 400 })
  }

  const { token } = await signInWithGitHub({ code })

  const cookieStore = await cookies()
  cookieStore.set('githubToken', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
