'use client'

import {
  CreditCardIcon,
  Loader2,
  PanelsTopLeftIcon,
  UsersIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { getProjects } from '@/http/get-projects'
import { useQuery } from '@tanstack/react-query'

export default function NavigationTabs() {
  const { slug: org } = useParams<{ slug: string }>()

  const pathname = usePathname()

  const parts = pathname.split('/')
  const tab = parts[3] ?? ''

  const defaultValue = tab ? tab : 'projects'

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', org],
    queryFn: () => getProjects(org!),
    enabled: !!org,
  })

  const projectsCount = Array.isArray(projects)
    ? projects.length
    : (projects?.projects?.length ?? 0)

  return (
    <Tabs defaultValue={defaultValue}>
      <ScrollArea>
        <TabsList className="mb-3">
          <TabsTrigger asChild value="projects" className="group">
            <Link href={`/org/${org}`}>
              <PanelsTopLeftIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Projetos
              <Badge
                className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                variant="secondary"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  projectsCount
                )}
              </Badge>
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="members">
            <Link href={`/org/${org}/members`}>
              <UsersIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Membros
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="billing" className="group">
            <Link href={`/org/${org}/billing`}>
              <CreditCardIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Contas
            </Link>
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  )
}
