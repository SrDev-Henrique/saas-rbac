import { api } from './api-client'

interface CreateInviteRequest {
  email: string
  role: string
  invitedName: string
  org: string
}

type CreateInviteResponse = void

export async function createInvite({
  email,
  role,
  invitedName,
  org,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  await api.post(`organizations/${org}/invites`, {
    json: {
      email,
      role,
      invitedName,
    },
  })
}
