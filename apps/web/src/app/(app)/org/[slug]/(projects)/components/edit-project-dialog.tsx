import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PencilIcon } from 'lucide-react'
import EditProjectForm from './edit-project-form'

export interface initialValues {
  name: string
  description: string
}

export default function EditProjectDialog({
  orgSlug,
  projectId,
  dialogOpen,
  setDialogOpen,
  initialValues,
  projectSlug,
}: {
  orgSlug: string
  projectId: string
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  initialValues: initialValues
  projectSlug?: string
}) {
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setDialogOpen(false)
        }
        if (open) {
          setDialogOpen(open)
        }
      }}
    >
      <DialogTrigger className="hidden size-full cursor-pointer">
        <div className="flex items-center gap-2">
          <PencilIcon size={16} aria-hidden="true" />
          Editar
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sm:text-center">Editar projeto</DialogTitle>
          <DialogDescription className="sm:text-center">
            Edite as informações do projeto.
          </DialogDescription>
        </DialogHeader>

        <EditProjectForm
          orgSlug={orgSlug}
          projectId={projectId}
          initialValues={initialValues}
          projectSlug={projectSlug}
        />
      </DialogContent>
    </Dialog>
  )
}
