import { api } from './api-client'

interface RemoveMemberRequest {
  slug: string
  memberId: string
}

type RemoveMemberResponse = void

export async function removeMember({
  slug,
  memberId,
}: RemoveMemberRequest): Promise<RemoveMemberResponse> {
  await api.delete(`organizations/${slug}/members/${memberId}`)
}
