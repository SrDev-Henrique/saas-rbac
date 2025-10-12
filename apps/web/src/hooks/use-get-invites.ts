import { useQuery } from '@tanstack/react-query'
import { getInvites } from '@/http/get-invites'

type UseGetInvitesParams = { slug: string | undefined }

export function useGetInvites({ slug }: UseGetInvitesParams) {
  const query = useQuery({
    queryKey: ['invites', slug],
    queryFn: async () => {
      if (!slug) return null
      const { invites } = await getInvites({ slug })
      return {
        invites,
      }
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  })

  return query
}
