import { api } from './api-client'

interface GetOrganizationRequest {
  slug: string
}

interface GetOrganizationResponse {
  organization: {
    id: string
    name: string
    slug: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    description: string | null
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
    ownerId: string
  }
}

export async function getOrganization({ slug }: GetOrganizationRequest) {
  const response = await api
    .get(`organizations/${slug}`)
    .json<GetOrganizationResponse>()

  return response
}
