'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { GetProjectsResponse } from '@/http/get-projects'
import { cn } from '@/lib/utils'
import { formatDistanceToNow, setDefaultOptions } from 'date-fns'
import { CalendarDays, EyeIcon } from 'lucide-react'
import { useEffect } from 'react'
import ProjectCardOptions from './project-options'
import { ptBR } from 'date-fns/locale'
import { useAbility } from '@/hooks/use-ability'
import Link from 'next/link'
import { z } from 'zod'

setDefaultOptions({ locale: ptBR })

const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(),
  ownerId: z.string(),
})

export default function ProjectsList({
  projects,
  isLoading,
  slug,
}: {
  projects: GetProjectsResponse['projects']
  isLoading: boolean
  slug: string
}) {
  const projectsList = projects ?? []

  let length: number = projectsList.length
  useEffect(() => {
    length = projectsList.length
  }, [projectsList])

  const permissions = useAbility({ slug })

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-20 rounded-md" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-20 w-full rounded-md" />
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex w-full flex-col gap-4 self-end">
                  <div className="flex w-full items-end justify-between">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <div className="bg-secondary flex items-center space-x-1.5 rounded-full border px-1.5 py-1">
                        <Skeleton className="size-5 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-10 rounded-md" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            'grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4',
            length <= 2 && 'grid-cols-[repeat(auto-fit,minmax(360px,350px))]',
          )}
        >
          {projectsList.map((project) => {
            const authProject = projectSchema.parse(project)
            const canDeleteProject = permissions.data?.can(
              'delete',
              authProject,
            )
            const canEditProject = permissions.data?.can('update', authProject)
            return (
              <Card className="relative justify-between" key={project.id}>
                <ProjectCardOptions
                  initialValues={project}
                  orgSlug={slug}
                  projectId={project.id}
                  canDeleteProject={canDeleteProject}
                  canEditProject={canEditProject}
                />
                <CardHeader className="relative">
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="line-clamp-4">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex w-full flex-col gap-4 self-end">
                    <div className="flex w-full items-end justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-muted-foreground text-xs">
                          Criado por:
                        </p>
                        <div className="bg-secondary flex items-center space-x-1.5 rounded-full border px-1.5 py-1">
                          <Avatar className="size-5">
                            <AvatarImage src={project.owner.avatarUrl ?? ''} />
                            <AvatarFallback>
                              {project.owner.name?.charAt(0).toUpperCase() ??
                                '??'}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-foreground text-sm font-medium hover:underline">
                            {project.owner.name ?? 'Nome não informado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 pb-2">
                        <CalendarDays className="text-muted-foreground size-4" />
                        <p className="text-muted-foreground text-xs">
                          {formatDistanceToNow(project.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/org/${slug}/project/${project.slug}`}>
                          <EyeIcon className="size-4" /> Visualizar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
