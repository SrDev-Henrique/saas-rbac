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
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  const res = await fetch(`/api/organizations/${slug}/projects`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }

  const data = (await res.json()) as GetProjectsResponse
  return data
}
