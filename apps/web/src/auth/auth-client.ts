import { getMembership } from '@/http/get-membership'
import { defineAbilityFor } from '@saas/auth'

type Props = { params: { slug: string } }

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
