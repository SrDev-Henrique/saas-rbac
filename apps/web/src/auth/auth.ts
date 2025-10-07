import { getProfile } from '@/http/get-profile'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  return Boolean(token)
}

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/sign-in')
  }

  try {
    const { user } = await getProfile()
    return user
  } catch (_err) {}
  redirect('/api/auth/sign-out')
}
