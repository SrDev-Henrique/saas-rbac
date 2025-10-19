'use server'
import { redirect } from 'next/navigation'

export async function signInWithGitHub() {
  const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInUrl.searchParams.set(
    'client_id',
    process.env.GITHUB_OAUTH_CLIENT_ID!,
  )
  githubSignInUrl.searchParams.set(
    'redirect_uri',
    process.env.GITHUB_OAUTH_REDIRECT_URI!,
  )
  githubSignInUrl.searchParams.set('scope', 'user')

  redirect(githubSignInUrl.toString())
}
