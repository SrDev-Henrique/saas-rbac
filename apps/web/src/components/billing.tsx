'use client'

import { useGetBilling } from '@/hooks/use-get-billing'
import { usePathname } from 'next/navigation'

export default function Billing() {
  const pathname = usePathname()
  const parts = pathname.split('/')
  const slug = parts[2] ?? ''

  const { data: billing } = useGetBilling({ slug })

  return (
    <div>
      <h1>{billing?.billing.total}</h1>
    </div>
  )
}
