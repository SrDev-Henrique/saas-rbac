import { useQuery } from '@tanstack/react-query'
import { getMembership } from '@/http/get-membership'
import { defineAbilityFor, type Role } from '@saas/auth'

type UseAbilityParams = { slug: string | undefined }

export function useAbility({ slug }: UseAbilityParams) {
  const query = useQuery({
    queryKey: ['ability', slug],
    queryFn: async () => {
      if (!slug) return null
      const { membership } = await getMembership(slug)
      return defineAbilityFor({
        id: membership.userId,
        role: membership.role as Role,
      })
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  })

  return query
}
