import { api } from './api-client'

interface RevokeInviteRequest {
  slug: string
  inviteId: string
}

type RevokeInviteResponse = void

export async function revokeInvite({
  slug,
  inviteId,
}: RevokeInviteRequest): Promise<RevokeInviteResponse> {
  await api.delete(`organizations/${slug}/invites/${inviteId}/revoke`)
}
