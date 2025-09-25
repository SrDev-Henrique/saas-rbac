import { api } from './api-client'

interface GetOrganizationsResponse {
  organizations: {
    role: 'ADMIN' | 'MEMBER' | 'BILLING'
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  const response = await api
    .get('organizations')
    .json<GetOrganizationsResponse>()

  console.log(response)

  return response
}
