import { BoltIcon, EllipsisIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { deleteProject } from '@/http/delete-project'
import DeleteProjectConfirmation from './delete-project-confirmation'
import { queryClient } from '@/lib/react-query'
import EditProjectDialog, { initialValues } from './edit-project-dialog'

export default function ProjectCardOptions({
  orgSlug,
  projectId,
  initialValues,
  canDeleteProject,
  canEditProject,
}: {
  orgSlug: string
  projectId: string
  initialValues: initialValues
  canDeleteProject: boolean | undefined
  canEditProject: boolean | undefined
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  async function handleDeleteProject() {
    try {
      setIsDeleting(true)
      await deleteProject({ slug: orgSlug, projectId })
      queryClient.invalidateQueries({ queryKey: ['projects', orgSlug] })
      setIsDeleting(false)
      setDialogOpen(false)
      setMenuOpen(false)
    } catch (error) {
      console.error(error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="absolute top-2 right-2 z-10">
      <DropdownMenu
        open={menuOpen}
        onOpenChange={(open) => {
          if (!open && dialogOpen) return
          setMenuOpen(open)
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-2.5 pe-3.5">
            <EllipsisIcon
              className="-me-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <button
                disabled={!canEditProject}
                className="text-primary hover:text-primary focus:text-primary hover:bg-primary/10 focus:bg-primary/10 w-full disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
                Editar
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <button
                disabled={!canDeleteProject}
                className="text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 w-full disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDialogOpen(true)
                }}
              >
                <TrashIcon size={16} aria-hidden="true" />
                Deletar
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteProjectConfirmation
        isDeleting={isDeleting}
        onDelete={handleDeleteProject}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />

      <EditProjectDialog
        orgSlug={orgSlug}
        projectId={projectId}
        dialogOpen={isEditing}
        setDialogOpen={setIsEditing}
        initialValues={initialValues}
      />
    </div>
  )
}
