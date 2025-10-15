import { BoltIcon, EllipsisVerticalIcon, TrashIcon } from 'lucide-react'
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

export default function ProjectCardOptions({
  orgSlug,
  projectId,
}: {
  orgSlug: string
  projectId: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
            <EllipsisVerticalIcon
              className="-me-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
              Editar
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <button
                className="text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 w-full"
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
    </div>
  )
}
