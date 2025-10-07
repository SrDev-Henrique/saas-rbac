import { api } from './api-client'

interface GetMembersRequest {
  slug: string
}

interface GetMembersResponse {
  members: {
    userId: string
    name: string
    avatarUrl: string
    email: string
  }[]
}

export async function getMembers({ slug }: GetMembersRequest) {
  const response = await api
    .get(`organizations/${slug}/members`)
    .json<GetMembersResponse>()

  return response
}
