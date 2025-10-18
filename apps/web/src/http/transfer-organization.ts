import { api } from './api-client'

interface TransferOrganizationRequest {
  orgSlug: string
  newOwnerId: string
}

type TransferOrganizationResponse = void

export async function transferOrganization({
  orgSlug,
  newOwnerId,
}: TransferOrganizationRequest): Promise<TransferOrganizationResponse> {
  await api.patch(`organizations/${orgSlug}/owner`, {
    json: {
      newOwnerId,
    },
  })
}
