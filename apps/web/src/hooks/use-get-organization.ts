import { useQuery } from '@tanstack/react-query'
import { getOrganization } from '@/http/get-organization'

type UseGetOrganizationParams = { slug: string | undefined }

export function useGetOrganization({ slug }: UseGetOrganizationParams) {
  const query = useQuery({
    queryKey: ['organization', slug],
    queryFn: async () => {
      if (!slug) return null
      const { organization } = await getOrganization({ slug })
      return {
        organization,
      }
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  })

  return query
}
