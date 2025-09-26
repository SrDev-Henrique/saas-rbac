import { Role } from "@saas/auth"
import { api } from './api-client'

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
  const response = await api
    .get('organizations')
    .json<GetOrganizationsResponse>()

  return response
}
