import { api } from './api-client'

export interface GetProjectResponse {
  project: {
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
  }
}

export async function getProject(slug: string, projectSlug: string) {
  const result = await api
    .get(`organizations/${slug}/projects/${projectSlug}`)
    .json<GetProjectResponse>()
  return result
}
