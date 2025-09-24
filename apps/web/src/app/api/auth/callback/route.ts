import { signInWithGitHub } from '@/http/sign-in-with-github'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { HTTPError } from 'ky'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Code is missing' }, { status: 400 })
  }

  try {
    const { token } = await signInWithGitHub({ code })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.search = ''

    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    let message = 'Erro ao autenticar com GitHub'
    if (err instanceof HTTPError) {
      const data = (await err.response.json().catch(() => ({}))) as any
      message = data?.message ?? message
    }

    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/sign-in'
    redirectUrl.searchParams.set('error', message)

    return NextResponse.redirect(redirectUrl)
  }
}
