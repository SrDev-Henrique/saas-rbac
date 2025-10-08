import { api } from './api-client'

interface UpdateOrganizationRequest {
  name: string
  domain: string | undefined
  shouldAttachUsersByDomain: boolean | undefined
  avatarUrl: string | null
  description: string | null
  org: string
}

type UpdateOrganizationResponse = { slug: string }

export async function updateOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
  avatarUrl,
  description,
  org,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  const res = await api.put(`organizations/${org}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
      description,
    },
  })
  const data = (await res.json()) as UpdateOrganizationResponse
  return data
}
