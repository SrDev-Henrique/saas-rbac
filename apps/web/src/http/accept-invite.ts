import { api } from './api-client'

interface AcceptInviteRequest {
  inviteId: string
}

interface AcceptInviteResponse {
  message: string
  organizationSlug: string
}

export async function acceptInvite({ inviteId }: AcceptInviteRequest) {
  const response = await api
    .post(`invites/${inviteId}/accept`)
    .json<AcceptInviteResponse>()
  return response
}
