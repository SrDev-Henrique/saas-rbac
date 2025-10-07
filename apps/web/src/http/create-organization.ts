import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | undefined
  shouldAttachUsersByDomain: boolean | undefined
  avatarUrl: string | null
  description: string | null
}

type CreateOrganizationResponse = void

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
  avatarUrl,
  description,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  await api.post('organizations', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
      description,
    },
  })
}
