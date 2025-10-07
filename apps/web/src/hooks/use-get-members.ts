import { useQuery } from '@tanstack/react-query'
import { getMembers } from '@/http/get-members'

type UseGetMembersParams = { slug: string | undefined }

export function useGetMembers({ slug }: UseGetMembersParams) {
  const query = useQuery({
    queryKey: ['members', slug],
    queryFn: async () => {
      if (!slug) return null
      const { members } = await getMembers({ slug })
      return {
        members,
      }
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  })

  return query
}
