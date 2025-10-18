'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getProject } from '@/http/get-project'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeftIcon, BoltIcon, CalendarDays, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import EditProjectDialog from '../../(projects)/components/edit-project-dialog'
import DeleteProjectConfirmation from '../../(projects)/components/delete-project-confirmation'
import { toast } from 'sonner'
import { useState } from 'react'
import { deleteProject } from '@/http/delete-project'
import { queryClient } from '@/lib/react-query'
import Toast from '@/components/toast'

export default function ProjectClientPage({ slug }: { slug: string }) {
  const pathname = usePathname()
  const projectSlug = pathname.split('/')[4]

  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['project', projectSlug],
    queryFn: () => getProject(slug, projectSlug),
    enabled: !!slug && !!projectSlug,
  })

  const project = data?.project
  const projectId = project?.id ?? ''

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const initialValues = {
    name: project?.name ?? '',
    description: project?.description ?? '',
  }

  async function handleDeleteProject() {
    try {
      setIsDeleting(true)
      console.log(projectId)
      await deleteProject({ slug, projectId })
      queryClient.invalidateQueries({ queryKey: ['projects', slug] })
      setIsDeleting(false)
      setDialogOpen(false)
      toast.custom((t) => (
        <Toast
          message="Projeto deletado com sucesso"
          onClick={() => toast.dismiss(t)}
        />
      ))
      router.push(`/org/${slug}`)
    } catch (error) {
      setIsDeleting(false)
      toast.custom((t) => (
        <Toast
          error={true}
          message="Erro ao deletar projeto"
          errorMessage={(error as Error).message}
          onClick={() => toast.dismiss(t)}
        />
      ))
    }
  }

  return (
    <>
      {isLoading || !project ? (
        <div className="w-full space-y-4">
          <Skeleton className="h-10 w-20 rounded-md" />
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <div className="bg-secondary flex items-center space-x-1.5 rounded-full border px-1.5 py-1">
                    <Skeleton className="size-5 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="size-5 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="relative w-full space-y-4">
          <Button variant="outline" asChild>
            <Link href={`/org/${slug}`}>
              <ArrowLeftIcon className="size-4" /> Voltar
            </Link>
          </Button>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={project?.avatarUrl ?? ''} />
                <AvatarFallback>
                  {project?.owner?.name
                    ?.split(' ')
                    .map((name) => name.charAt(0).toUpperCase())
                    .join('') ?? '??'}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">{project?.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <BoltIcon className="size-4" />
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDialogOpen(true)
                }}
              >
                <TrashIcon className="size-4" />
                Deletar
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Sobre o projeto</CardTitle>
              <CardDescription>{project?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground text-xs">Criado por:</p>
                  <div className="bg-secondary flex items-center space-x-1.5 rounded-full border px-1.5 py-1">
                    <Avatar>
                      <AvatarImage src={project?.owner?.avatarUrl ?? ''} />
                      <AvatarFallback>
                        {project?.owner?.name
                          ?.split(' ')
                          .map((name) => name.charAt(0).toUpperCase())
                          .join('') ?? '??'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-foreground text-sm font-medium hover:underline">
                      {project?.owner?.name ?? 'Nome não informado'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="text-muted-foreground size-4" />
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(project.createdAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DeleteProjectConfirmation
            isDeleting={isDeleting}
            onDelete={handleDeleteProject}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />

          <EditProjectDialog
            orgSlug={slug}
            projectId={projectId}
            dialogOpen={isEditing}
            setDialogOpen={setIsEditing}
            initialValues={initialValues}
            projectSlug={projectSlug}
          />
        </div>
      )}
    </>
  )
}
