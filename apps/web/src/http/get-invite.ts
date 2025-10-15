import { Role } from '@saas/auth'
import { api } from './api-client'

interface GetInviteRequest {
  inviteId: string
}

interface GetInviteResponse {
  invite: {
    id: string
    createdAt: Date
    invitedName: string
    role: Role
    email: string
    organization: {
      name: string
      avatarUrl: string | null
      slug: string
      members: {    
        user: {
          avatarUrl: string | null
        }
      }[]
    }
    author: {
      name: string | null
      avatarUrl: string | null
      id: string
    } | null
  }
}

export async function getInvite({ inviteId }: GetInviteRequest) {
  const response = await api
    .get(`invites/${inviteId}`)
    .json<GetInviteResponse>()

  return response
}
