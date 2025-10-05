import { getProfile } from '@/http/get-profile'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return false
  }

  return true
}

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/sign-in')
  }

  console.log('get user', token)

  try {
    const { user } = await getProfile()

    console.log('get user', user)

    return user
  } catch (err) {
    console.error('get user', err)
  }
  redirect('/api/auth/sign-out')
}
