import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Role } from '@saas/auth'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns'
import { revokeInvite } from '@/http/revoke-invite'
import { queryClient } from '@/lib/react-query'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

interface Invite {
  id: string
  email: string
  role: Role
  createdAt: Date
  invitedName: string
  author: {
    id: string
    name: string | null
    avatarUrl: string | null
  } | null
}

export default function Invite({
  invite,
  orgSlug,
}: {
  invite: Invite
  orgSlug: string
}) {
  const role = invite.role === 'BILLING' ? 'Faturamento' : 'Membro'
  setDefaultOptions({ locale: ptBR })

  async function handleRevokeInvite(inviteId: string) {
    try {
      await revokeInvite({ slug: orgSlug, inviteId })
      queryClient.invalidateQueries({ queryKey: ['invites', orgSlug] })
    } catch (error) {
      alert(error)
    }
  }
  return (
    <div className="bg-background max-w-[400px] rounded-md border p-4 shadow-lg">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={invite.author?.avatarUrl ?? ''} />
          <AvatarFallback>
            {invite.author?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex grow flex-col gap-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium hover:underline">
                {invite.author?.name}
              </span>{' '}
              convidou{' '}
              <span className="text-foreground font-medium hover:underline">
                {invite.invitedName ?? invite.email}
              </span>{' '}
              para a organização, com o cargo de{' '}
              <span className="text-foreground font-medium hover:underline">
                {role}
              </span>
              .
            </p>
            <p className="text-muted-foreground text-xs">
              {formatDistanceToNow(invite.createdAt)}
            </p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0"
              aria-label="Revogar convite"
            >
              <XIcon
                size={16}
                className="transition-opacity"
                aria-hidden="true"
              />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revogar convite?</DialogTitle>
              <DialogDescription className="mt-1">
                Você tem certeza que deseja revogar este convite?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => handleRevokeInvite(invite.id)}
              >
                Revogar convite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
