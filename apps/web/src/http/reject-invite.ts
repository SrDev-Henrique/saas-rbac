import { api } from './api-client'

interface RejectInviteRequest {
  inviteId: string
}

export async function rejectInvite({
  inviteId,
}: RejectInviteRequest): Promise<void> {
  await api.delete(`invites/${inviteId}/reject`)
}
