import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/http/get-projects'

export function useGetProjects(slug: string) {
  const query = useQuery({
    queryKey: ['projects', slug],
    queryFn: async () => {
      if (!slug) return null
      const { projects } = await getProjects(slug)
      return { projects }
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  })

  return query
}
