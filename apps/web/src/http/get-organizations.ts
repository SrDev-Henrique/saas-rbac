import { Role } from '@saas/auth'
import { api } from './api-client'

interface GetOrganizationResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
    role: Role
  }[]
}

export async function getOrganizations() {
  const response = await api
    .get(`organizations`)
    .json<GetOrganizationResponse>()

  return response
}
