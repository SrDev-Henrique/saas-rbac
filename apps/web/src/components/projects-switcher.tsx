'use client'

import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/http/get-projects'

type Projects = {
  projects: {
    id: string
    description: string
    name: string
    slug: string
    avatarUrl: string | null
    organizationId: string
    ownerId: string
    createdAt: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }[]
}

export default function ProjectsSwitcher() {
  const router = useRouter()

  const { slug: orgSlug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery<Projects>({
    queryKey: ['projects', orgSlug],
    queryFn: () => getProjects(orgSlug),
    enabled: !!orgSlug,
  })
  const projects = data?.projects ?? []

  const currentValue =
    projects?.length && projects?.length > 0 ? projects[0].slug : 'no-project'

  return (
    <div className="*:not-first:mt-2">
      <Select
        value={currentValue}
        onValueChange={(value) => {
          if (value === 'select-project') return

          if (value === 'create-project') {
            router.push('/create-project')
          } else if (value === 'no-project') {
            return
          } else {
            router.push(`/org/${orgSlug}/project/${value}`)
          }
        }}
      >
        <SelectTrigger className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
          <SelectValue placeholder="Selecione um projeto" />
        </SelectTrigger>

        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          <SelectGroup>
            <SelectItem className="hidden" value="select-org" disabled>
              Selecione um projeto
            </SelectItem>
          </SelectGroup>

          {projects?.length && projects?.length > 0 ? (
            <SelectGroup>
              <SelectLabel className="ps-2">
                Mudar para outro projeto
              </SelectLabel>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.slug}>
                  <Avatar className="size-6">
                    <AvatarImage
                      src={project.avatarUrl ?? ''}
                      alt={project.name}
                    />
                    <AvatarFallback>
                      {project.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">{project.name}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          ) : (
            <SelectGroup>
              <SelectItem value="no-project" disabled>
                Nenhum projeto encontrado
              </SelectItem>
            </SelectGroup>
          )}

          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="create-project">
              <PlusIcon /> Criar novo projeto
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
