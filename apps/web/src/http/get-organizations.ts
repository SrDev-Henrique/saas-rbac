import { Role } from '@saas/auth'

interface GetOrganizationsResponse {
  organizations: {
    role: Role
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  const res = await fetch('/api/organizations', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch organizations')
  }

  const data = (await res.json()) as GetOrganizationsResponse

  return data
}
