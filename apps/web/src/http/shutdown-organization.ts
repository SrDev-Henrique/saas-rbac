import { api } from './api-client'

interface ShutdownOrganizationRequest {
  slug: string
}

type ShutdownOrganizationResponse = void

export async function shutdownOrganization({
  slug,
}: ShutdownOrganizationRequest): Promise<ShutdownOrganizationResponse> {
  await api.delete(`organizations/${slug}`)
}
