'use client'

import { useId, useState } from 'react'
import { CircleAlertIcon, Loader2 } from 'lucide-react'

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

export default function DeleteConfirmation({
  isOrg,
  name,
  onDelete,
  isDeleting,
  setIsDeleting,
  disabled,
}: {
  isOrg: boolean
  name: string
  onDelete: () => void
  isDeleting: boolean
  setIsDeleting: (isDeleting: boolean) => void
  disabled: boolean | undefined
}) {
  const id = useId()
  const [inputValue, setInputValue] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={disabled}>
          {isOrg ? 'Deletar organização' : 'Deletar projeto'}
        </Button>
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
              {`Esta ação não pode ser desfeita. Para confirmar, por favor, digite o nome d${isOrg ? 'a organização' : 'o projeto'}`}{' '}
              <span className="text-foreground">{name}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>
              {isOrg ? 'Nome da organização' : 'Nome do projeto'}
            </Label>
            <Input
              id={id}
              type="text"
              placeholder={`Digite ${name} para confirmar`}
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
              disabled={inputValue !== name || isDeleting}
              onClick={onDelete}
              variant="destructive"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Deletando...
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
