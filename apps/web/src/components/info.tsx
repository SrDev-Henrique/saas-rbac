'use client'

import { cn } from '@/lib/utils'
import AvatarGroup from './avatar-group'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'
import EditInfo from './edit-info'
import OrganizationForm from '@/app/(app)/org/organization-form'
import DeleteConfirmation from './origin-ui/delete-confirmation'
import { shutdownOrganization } from '@/http/shutdown-organization'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import Toast from './toast'

export default function Info({
  avatarUrl,
  name,
  lastName,
  email,
  domain,
  description,
  shouldAttachUsersByDomain,
  isLoading,
  members,
  isMembersLoading,
  slug,
  isOrg,
}: {
  avatarUrl: string
  name: string
  lastName?: string
  email?: string
  domain?: string
  description?: string
  shouldAttachUsersByDomain?: boolean
  isLoading?: boolean
  members?: {
    userId: string
    name: string
    avatarUrl: string
    email: string
  }[]
  isMembersLoading?: boolean
  slug: string
  isOrg?: boolean
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleShutdown() {
    try {
      setIsDeleting(true)
      await shutdownOrganization({ slug })
      setIsDeleting(false)
      toast.custom((t) => (
        <Toast
          message="Organização deletada com sucesso"
          onClick={() => toast.dismiss(t)}
        />
      ))
      router.push('/')
      router.refresh()
    } catch (_error) {
      // Non-intrusive fallback; optionally replace with a toast system
      toast.custom((t) => (
        <Toast
          error={true}
          message="Falha ao deletar a organização. Tente novamente."
          errorMessage={(_error as Error).message}
          onClick={() => toast.dismiss(t)}
        />
      ))
      setIsDeleting(false)
    }
  }

  const initiaData = {
    name,
    domain,
    description: description ?? null,
    avatarUrl,
    shouldAttachUsersByDomain,
  }

  const validDescription =
    description !== null && description !== undefined && description !== ''
      ? description
      : 'Nenhuma descrição'

  return (
    <Card className="bg-secondary dark:bg-card mx-auto max-w-md">
      <CardContent className="space-y-4">
        <div className="relative flex items-center justify-center">
          <Avatar className="z-10 size-14 md:size-20">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {name ? (
                name?.charAt(0).toUpperCase() + name?.charAt(1).toUpperCase()
              ) : (
                <Skeleton className="dark:bg-popover size-14 rounded-full md:size-20" />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="dark:bg-popover absolute top-12 h-0.5 w-full" />
        </div>
        {members && members.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            {isMembersLoading ? (
              <Skeleton className="bg-popover h-14 w-20 rounded-md md:h-20 md:w-32" />
            ) : (
              <>
                <p className="text-muted-foreground text-sm font-medium">
                  {members.length > 1 ? 'Membros' : 'Membro'}
                </p>
                <AvatarGroup
                  avatarUrls={members.map((member) => member.avatarUrl)}
                  names={members.map((member) => member.name)}
                />
              </>
            )}
          </div>
        )}
        <div className="flex items-center justify-center gap-4">
          <div className="flex w-full flex-col">
            {isLoading ? (
              <div className="flex w-full flex-col gap-1">
                <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />{' '}
                <Skeleton className="dark:bg-popover h-9 w-full rounded-md" />
              </div>
            ) : (
              <>
                <p className="font-medium">Nome</p>
                <p className="bg-popover dark:bg-background border-border mt-1 truncate rounded-md border p-2 text-sm font-medium">
                  {name ?? (
                    <span className="text-muted-foreground">
                      Nenhuma informação
                    </span>
                  )}
                </p>
              </>
            )}
          </div>
          <div className="w-full">
            {isLoading ? (
              <div className="flex w-full flex-col gap-1">
                <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />{' '}
                <Skeleton className="dark:bg-popover h-9 w-full rounded-md" />
              </div>
            ) : (
              <div className="flex w-full flex-col gap-1">
                <p className="font-medium">{isOrg ? 'Domínio' : 'Sobrenome'}</p>
                <p
                  className={cn(
                    'bg-popover dark:bg-background border-border mt-1 truncate rounded-md border p-2 text-sm font-medium',
                    !domain && 'text-muted-foreground',
                  )}
                >
                  {domain ?? lastName ?? 'Nenhuma informação'}
                </p>
              </div>
            )}
          </div>
        </div>
        {email && (
          <div className="flex flex-col gap-1">
            {isLoading ? (
              <>
                <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />{' '}
                <Skeleton className="dark:bg-popover h-9 w-full rounded-md" />
              </>
            ) : (
              <>
                <p className="font-medium">Email</p>
                <p className="bg-popover dark:bg-background border-border truncate rounded-md border p-2 text-sm font-medium">
                  {email}
                </p>
              </>
            )}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <>
              <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />{' '}
              <Skeleton className="dark:bg-popover h-9 w-full rounded-md" />
            </>
          ) : (
            <>
              <p className="font-medium">Descrição</p>
              <p
                className={cn(
                  'bg-popover dark:bg-background border-border rounded-md border p-2 text-sm font-medium',
                  !description && 'text-muted-foreground',
                )}
              >
                {validDescription}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <EditInfo disabled={isLoading}>
            <OrganizationForm
              isEditing={true}
              initialData={initiaData}
              org={slug}
            />
          </EditInfo>
          <DeleteConfirmation
            disabled={isLoading}
            isOrg={true}
            name={name}
            onDelete={handleShutdown}
            isDeleting={isDeleting}
          />
        </div>
      </CardContent>
    </Card>
  )
}
