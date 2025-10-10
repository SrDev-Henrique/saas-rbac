'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateMember } from '@/http/update-member'
import { queryClient } from '@/lib/react-query'
import { Role } from '@saas/auth'
import { CreditCardIcon, UserIcon } from 'lucide-react'

export default function UpdateMemberRole({
  value,
  memberId,
  org,
}: {
  value: string
  memberId: string
  org: string
}) {
  async function HandleUpdateMemberRole(value: string) {
    await updateMember({
      slug: org,
      memberId,
      role: value as Role,
    })
    queryClient.invalidateQueries({ queryKey: ['members', org] })
  }
  return (
    <div className="*:not-first:mt-2">
      <Select onValueChange={HandleUpdateMemberRole} value={value}>
        <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          <SelectItem value="MEMBER">
            <UserIcon size={16} aria-hidden="true" />
            <span className="truncate">Membro</span>
          </SelectItem>
          <SelectItem value="BILLING">
            <CreditCardIcon size={16} aria-hidden="true" />
            <span className="truncate">Faturamento</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
