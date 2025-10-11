import { Role } from '@saas/auth'
import { api } from './api-client'

interface GetInvitesRequest {
  slug: string
}

interface GetInvitesResponse {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: Date
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }[]
}

export async function getInvites({ slug }: GetInvitesRequest) {
  const response = await api
    .get(`organizations/${slug}/invites`)
    .json<GetInvitesResponse>()

  return response
}
