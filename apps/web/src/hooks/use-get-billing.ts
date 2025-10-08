import { useQuery } from '@tanstack/react-query'
import { getBilling } from "@/http/get-billing"

type UseGetBillingParams = { slug: string | undefined }

export function useGetBilling({ slug }: UseGetBillingParams) {
  const query = useQuery({
    queryKey: ['billing', slug],
    queryFn: async () => {
      if (!slug) return null
      const { billing } = await getBilling({ slug })
      return {
        billing,
      }
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
  })

  return query
}
