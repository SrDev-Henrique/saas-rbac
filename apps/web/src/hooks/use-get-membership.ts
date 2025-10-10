import { useQuery } from '@tanstack/react-query'
import { getMembership } from '@/http/get-membership'

type UseGetMembershipParams = { slug: string | undefined }

export function useGetMembership({ slug }: UseGetMembershipParams) {
  const query = useQuery({
    queryKey: ['membership', slug],
    queryFn: async () => {
      if (!slug) return null
      const { membership } = await getMembership(slug)
      return {
        membership,
      }
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  })

  return query
}
