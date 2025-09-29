import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
  domain: string | undefined
  shouldAttachUsersByDomain: boolean | undefined
  avatarUrl: string | null
}

type CreateOrganizationResponse = void

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
  avatarUrl,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  await api.post('organizations', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
    },
  })
}
