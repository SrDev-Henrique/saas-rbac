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

export default function TransferConfirmation({
  name,
  onTransfer,
  isTransferring,
  Icon,
}: {
  name: string
  onTransfer: () => void
  isTransferring: boolean
  Icon?: React.ReactNode
}) {
  const id = useId()
  const [inputValue, setInputValue] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {Icon}
          Transferir propriedade
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
              {`Caso queira confirmar a transferência da propriedade desta organização, por favor, digite o nome do membro`}{' '}
              <span className="text-foreground">{name}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>Nome do membro</Label>
            <Input
              id={id}
              type="text"
              placeholder={`Digite ${name} para confirmar a transferência`}
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
              disabled={inputValue !== name || isTransferring}
              onClick={() => onTransfer()}
            >
              {isTransferring ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Transferindo...
                </div>
              ) : (
                'Transferir'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
