import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CircleAlertIcon, Loader2, TrashIcon } from 'lucide-react'
import { useId, useState } from 'react'

export default function DeleteProjectConfirmation({
  onDelete,
  isDeleting,
  dialogOpen,
  setDialogOpen,
}: {
  onDelete: () => void
  isDeleting: boolean
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}) {
  const id = useId()
  const [inputValue, setInputValue] = useState('')

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
          <TrashIcon size={16} aria-hidden="true" />
          Deletar
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Confirmação final
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Esta ação não pode ser desfeita. Para confirmar, por favor, digite{' '}
              <span className="text-foreground">Deletar projeto</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>Confirmar</Label>
            <Input
              id={id}
              type="text"
              placeholder="Digite 'Deletar projeto' para deletar"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="flex-1"
              disabled={inputValue !== 'Deletar projeto' || isDeleting}
              onClick={onDelete}
              variant="destructive"
            >
              {isDeleting ? (
                <div>
                  <Loader2 className="size-4 animate-spin" />
                </div>
              ) : (
                'Deletar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
