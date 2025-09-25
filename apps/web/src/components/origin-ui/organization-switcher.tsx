import { useId, useMemo } from 'react'

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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { PlusIcon } from 'lucide-react'
import { getOrganizations } from '@/http/get-organizations'

export default async function OrganizationSwitcher() {
  const { organizations } = await getOrganizations()

  const defaultValue =
    organizations.length > 0 ? organizations[0].id : 'no-organization'
  return (
    <div className="*:not-first:mt-2">
      <Select defaultValue={defaultValue}>
        <SelectTrigger className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
          <SelectValue placeholder="Selecione uma organização" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          {organizations.length > 0 ? (
            <SelectGroup>
              <SelectLabel className="ps-2">
                Mudar para outra organização
              </SelectLabel>
              {organizations.map((organization) => (
                <SelectItem key={organization.id} value={organization.id}>
                  <Avatar>
                    <AvatarImage
                      src={organization.avatarUrl ?? ''}
                      alt={organization.name}
                    />
                    <AvatarFallback>
                      {organization.name.charAt(0).toUpperCase() +
                        organization.name.charAt(1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1 truncate">
                    {organization.name}
                  </span>
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
