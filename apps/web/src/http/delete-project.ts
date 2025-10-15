import { api } from './api-client'

interface DeleteProjectRequest {
  slug: string
  projectId: string
}

type DeleteProjectResponse = void

export async function deleteProject({
  slug,
  projectId,
}: DeleteProjectRequest): Promise<DeleteProjectResponse> {
  await api.delete(`organizations/${slug}/projects/${projectId}`)
}
