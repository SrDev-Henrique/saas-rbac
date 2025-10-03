'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { PlusIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getOrganizations } from '@/http/get-organizations'
import { Skeleton } from './ui/skeleton'

type OrganizationsResponse = {
  organizations: {
    role: 'ADMIN' | 'MEMBER' | 'BILLING'
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export default function OrganizationSwitcherClient() {
  const router = useRouter()
  const pathname = usePathname() ?? '/'

  const parts = pathname.split('/')
  const slug = parts[2] ?? ''

  const createOrg = parts[1] === 'create-org'

  const isRoot = pathname === '/' || pathname === ''

  const { data, isLoading } = useQuery<OrganizationsResponse>({
    queryKey: ['organizations'],
    queryFn: () => getOrganizations(),
  })

  const organizations = data?.organizations ?? []

  const currentValue = createOrg
    ? 'create-org'
    : slug
      ? slug
      : isRoot
        ? 'select-org'
        : organizations.length > 0
          ? organizations[0].slug
          : 'no-organization'

  return (
    <div className="*:not-first:mt-2">
      {isLoading ? (
        <div className="border-muted-foreground/20 flex items-center gap-2 rounded-md border p-1">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      ) : (
        <Select
          value={currentValue}
          onValueChange={(value) => {
            if (value === 'select-org') return

            if (value === 'create-org') {
              router.push('/create-org')
            } else if (value === 'no-organization') {
              return
            } else {
              router.push(`/org/${value}`)
            }
          }}
        >
          <SelectTrigger className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
            <SelectValue placeholder="Selecione uma organização" />
          </SelectTrigger>

          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
            <SelectGroup>
              <SelectItem className="hidden" value="select-org" disabled>
                Selecione uma organização
              </SelectItem>
            </SelectGroup>

            {organizations.length > 0 ? (
              <SelectGroup>
                <SelectLabel className="ps-2">
                  Mudar para outra organização
                </SelectLabel>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.slug}>
                    <Avatar className="size-6">
                      <AvatarImage src={org.avatarUrl ?? ''} alt={org.name} />
                      <AvatarFallback>
                        {org.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">{org.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              <SelectGroup>
                <SelectItem value="no-organization">
                  Nenhuma organização encontrada
                </SelectItem>
              </SelectGroup>
            )}

            <SelectSeparator />
            <SelectGroup>
              <SelectItem value="create-org">
                <PlusIcon /> Criar nova organização
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
