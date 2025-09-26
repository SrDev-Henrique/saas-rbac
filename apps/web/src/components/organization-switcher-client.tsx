// app/components/OrganizationSwitcher.client.tsx
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

interface Organizations {
  role: 'ADMIN' | 'MEMBER' | 'BILLING'
  id: string
  name: string
  slug: string
  avatarUrl: string | null
}

export default function OrganizationSwitcherClient({
  organizations,
}: {
  organizations: Organizations[]
}) {
  const router = useRouter()

  const pathname = usePathname()

  const parts = pathname.split('/')
  const slug = parts[2] ?? ''

  return (
    <div className="*:not-first:mt-2">
      <Select
        defaultValue={slug}
        onValueChange={(value) => {
          if (value === 'create-organization') {
            router.push('/org/create')
          } else if (value !== 'no-organization') {
            router.push(`/org/${value}`)
          }
        }}
      >
        <SelectTrigger className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
          <SelectValue placeholder="Selecione uma organização" />
        </SelectTrigger>

        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
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
            <SelectItem value="create-organization">
              <PlusIcon /> Criar nova organização
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
