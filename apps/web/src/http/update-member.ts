import { Role } from '@saas/auth'
import { api } from './api-client'

interface UpdateMemberRequest {
  slug: string
  memberId: string
  role: Role
}

type UpdateMemberResponse = void

export async function updateMember({
  slug,
  memberId,
  role,
}: UpdateMemberRequest): Promise<UpdateMemberResponse> {
  await api.put(`organizations/${slug}/members/${memberId}`, {
    json: {
      role,
    },
  })
}
