import { api } from './api-client'

interface EditProjectRequest {
  name: string | undefined
  description: string | undefined
  org: string
  projectId: string
}

type EditProjectResponse = void

export async function editProject({
  name,
  description,
  org,
  projectId,
}: EditProjectRequest): Promise<EditProjectResponse> {
  await api.put(`organizations/${org}/projects/${projectId}`, {
    json: { name, description },
  })
}
