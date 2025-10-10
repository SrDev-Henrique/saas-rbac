import { api } from './api-client'

interface TransferOrganizationRequest {
  newOwnerId: string
}

type TransferOrganizationResponse = void

export async function transferOrganization({
  newOwnerId,
}: TransferOrganizationRequest): Promise<TransferOrganizationResponse> {
  await api.patch(`organizations/${newOwnerId}/owner`, {
    json: {
      newOwnerId,
    },
  })
}
