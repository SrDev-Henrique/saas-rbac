import { useQuery } from '@tanstack/react-query'
import { getOrganizations } from '@/http/get-organizations'

export function useGetOrganizations() {
  const query = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { organizations } = await getOrganizations()
      return { organizations }
    },
  })

  return query
}
