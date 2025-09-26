import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'
import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = { params: { slug: string } }

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return false
  }

  return true
}

export function getCurrentOrganization({ params }: Props) {
  const currentOrganization = params.slug

  return currentOrganization
}

export async function getCurrentMembership({ slug }: { slug: string }) {
  const org = getCurrentOrganization({ params: { slug } })

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)

  return membership
}

export async function ability({ slug }: { slug: string }) {
  const membership = await getCurrentMembership({ slug: slug })

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
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
