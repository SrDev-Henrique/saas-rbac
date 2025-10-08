import { api } from './api-client'

interface GetBillingRequest {
  slug: string
}

interface GetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export async function getBilling({ slug }: GetBillingRequest) {
  const response = await api
    .get(`organizations/${slug}/billing`)
    .json<GetBillingResponse>()

  return response
}
