'use client'

import {
  CheckCircle2,
  Loader2,
  TriangleAlertIcon,
  UserRoundPlusIcon,
  UserX2Icon,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getPendingInvites } from '@/http/get-pending-invites'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow, setDefaultOptions } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from './ui/skeleton'
import { acceptInvite } from '@/http/accept-invite'
import { queryClient } from '@/lib/react-query'
import { toast } from 'sonner'
import Link from 'next/link'
import { useTransition } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { rejectInvite } from '@/http/reject-invite'
import Toast from './toast'

setDefaultOptions({ locale: ptBR })

export default function PendingInvites({ userId }: { userId: string }) {
  const { data, isLoading: isInvitesLoading } = useQuery({
    queryKey: ['pending-invites', userId],
    queryFn: getPendingInvites,
    enabled: !!userId,
  })

  const [isLoading, startTransition] = useTransition()

  const invites = data?.invites || []

  function handleAcceptInvite(inviteId: string) {
    startTransition(async () => {
      try {
        const acceptedInvite = invites.find((invite) => invite.id === inviteId)
        if (!acceptedInvite) {
          throw new Error('Convite não encontrado')
        }
        const orgSlug = acceptedInvite.organization.slug
        await acceptInvite({ inviteId })
        queryClient.invalidateQueries({ queryKey: ['pending-invites', userId] })
        queryClient.invalidateQueries({ queryKey: ['organizations'] })
        toast.custom((t) => (
          <Toast
            message="Convite aceito com sucesso"
            onClick={() => toast.dismiss(t)}
            action={true}
            href={`/org/${orgSlug}`}
            actionLabel="Ver organização"
          />
        ))
      } catch (error) {
        console.error(error)
        toast.custom((t) => (
          <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
            <div className="flex gap-2">
              <div className="flex grow gap-3">
                <TriangleAlertIcon
                  className="text-destructive mt-0.5 shrink-0"
                  size={16}
                  aria-hidden="true"
                />
                <div className="flex grow justify-between gap-12">
                  <p className="text-sm">
                    Erro ao aceitar convite: {(error as Error).message}
                  </p>
                  <Button
                    variant="outline"
                    className="text-sm font-medium hover:underline"
                    onClick={() => toast.dismiss(t)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                onClick={() => toast.dismiss(t)}
                aria-label="Fechar banner"
              >
                <X
                  size={16}
                  className="opacity-60 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        ))
      }
    })
  }

  function handleRejectInvite(inviteId: string) {
    startTransition(async () => {
      try {
        await rejectInvite({ inviteId })
        queryClient.invalidateQueries({ queryKey: ['pending-invites', userId] })
        toast.custom((t) => (
          <Toast
            message="Convite recusado com sucesso"
            onClick={() => toast.dismiss(t)}
          />
        ))
      } catch (error) {
        console.error(error)
        toast.custom((t) => (
          <Toast
            error={true}
            message="Erro ao recusar convite"
            errorMessage={(error as Error).message}
            onClick={() => toast.dismiss(t)}
          />
        ))
      }
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="relative"
          aria-label="Abrir convites pendentes"
        >
          <UserRoundPlusIcon size={16} aria-hidden="true" />
          {invites.length > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {invites.length > 99 ? '99+' : invites.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        {invites.length > 0 ? (
          <>
            {' '}
            <div className="text-sm font-semibold">Convites pendentes</div>
            <div
              role="separator"
              aria-orientation="horizontal"
              className="bg-border -mx-1 my-1 h-px"
            ></div>
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
              >
                {isInvitesLoading ? (
                  <div className="relative flex items-start gap-3 pe-3">
                    <Skeleton className="dark:bg-popover size-9 rounded-md" />
                    <div className="flex-1 space-y-1">
                      <div className="text-foreground/80 text-left after:absolute after:inset-0">
                        <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                        <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                        <Skeleton className="dark:bg-popover h-5 w-8 rounded-md" />
                      </div>
                      <Skeleton className="dark:bg-popover h-5 w-8 rounded-md" />
                    </div>
                    <div>
                      <Skeleton className="dark:bg-popover h-6 w-8 rounded-md" />
                      <Skeleton className="dark:bg-popover h-6 w-8 rounded-md" />
                    </div>
                  </div>
                ) : (
                  <div className="relative flex items-start gap-3 pe-3">
                    <Avatar className="size-9 rounded-md">
                      <AvatarImage src={invite.author?.avatarUrl || ''} />
                      {invite.author?.name ? (
                        <AvatarFallback>
                          {invite.author?.name?.charAt(0).toUpperCase() +
                            invite.author?.name?.charAt(1).toUpperCase()}
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback />
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="text-foreground/80 text-left after:absolute after:inset-0">
                        <span className="text-foreground font-medium hover:underline">
                          {invite.author?.name}
                        </span>{' '}
                        convidou você para a organização{' '}
                        <span className="text-foreground font-medium hover:underline">
                          {invite.organization.name}
                        </span>
                        , com o cargo de{' '}
                        <span className="text-foreground font-medium hover:underline">
                          {invite.role === 'BILLING' ? 'Faturamento' : 'Membro'}
                        </span>
                        .
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {formatDistanceToNow(invite.createdAt)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptInvite(invite.id)}
                          disabled={isLoading}
                          className="relative z-10"
                        >
                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            'Aceitar'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="relative z-10"
                          onClick={() => handleRejectInvite(invite.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            'Recusar'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-3">
            <UserX2Icon size={24} className="text-muted-foreground" />
            <div className="text-muted-foreground text-sm font-semibold">
              Nenhum convite pendente
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
