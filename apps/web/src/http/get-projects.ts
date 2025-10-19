import { api } from './api-client'

export interface GetProjectsResponse {
  projects: {
    id: string
    description: string
    name: string
    slug: string
    avatarUrl: string | null
    organizationId: string
    ownerId: string
    createdAt: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }[]
}

export async function getProjects(slug: string) {
  const result = await api
    .get(`organizations/${slug}/projects`)
    .json<GetProjectsResponse>()
  return result
}
