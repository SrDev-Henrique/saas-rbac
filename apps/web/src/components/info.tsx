'use client'

import { cn } from '@/lib/utils'
import AvatarGroup from './avatar-group'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'
import EditInfo from './edit-info'
import CreateOrganizationForm from '@/app/(app)/create-org/create-organization-form'
import DeleteConfirmation from './origin-ui/delete-confirmation'
import { shutdownOrganization } from '@/http/shutdown-organization'
import { useRouter } from 'next/navigation'

export default function Info({
  avatarUrl,
  name,
  lastName,
  email,
  domain,
  description,
  isLoading,
  members,
  isMembersLoading,
  slug,
}: {
  avatarUrl: string
  name: string
  lastName?: string
  email?: string
  domain?: string
  description?: string
  isLoading?: boolean
  members?: {
    userId: string
    name: string
    avatarUrl: string
    email: string
  }[]
  isMembersLoading?: boolean
  slug: string
}) {
  const router = useRouter()

  async function handleShutdown() {
    try {
      await shutdownOrganization({ slug })
      router.push('/')
      router.refresh()
    } catch (_error) {
      // Non-intrusive fallback; optionally replace with a toast system
      alert('Falha ao deletar a organização. Tente novamente.')
    }
  }

  return (
    <Card className="bg-secondary dark:bg-background mx-auto max-w-md">
      <CardContent className="space-y-4">
        <div className="relative flex items-center justify-center">
          {avatarUrl ? (
            <Avatar className="z-10 size-14 md:size-20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {name.charAt(1).toUpperCase() + name.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="bg-popover size-14 rounded-full md:size-20" />
          )}
          <div className="bg-popover absolute top-12 h-0.5 w-full" />
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
                />
              </>
            )}
          </div>
        )}
        <div className="flex items-center justify-center gap-4">
          <div className="flex w-full flex-col">
            {isLoading ? (
              <div className="flex w-full flex-col gap-1">
                <Skeleton className="bg-popover h-5 w-20 rounded-md" />{' '}
                <Skeleton className="bg-popover h-9 w-full rounded-md" />
              </div>
            ) : (
              <>
                <p className="font-medium">Nome</p>
                <p className="bg-popover border-border mt-1 truncate rounded-md border p-2 text-sm font-medium">
                  {name}
                </p>
              </>
            )}
          </div>
          <div className="w-full">
            {isLoading ? (
              <div className="flex w-full flex-col gap-1">
                <Skeleton className="bg-popover h-5 w-20 rounded-md" />{' '}
                <Skeleton className="bg-popover h-9 w-full rounded-md" />
              </div>
            ) : (
              <div className="flex w-full flex-col gap-1">
                <p className="font-medium">
                  {domain ? 'Domínio' : 'Sobrenome'}
                </p>
                <p
                  className={cn(
                    'bg-popover border-border mt-1 truncate rounded-md border p-2 text-sm font-medium',
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
                <Skeleton className="bg-popover h-5 w-20 rounded-md" />{' '}
                <Skeleton className="bg-popover h-9 w-full rounded-md" />
              </>
            ) : (
              <>
                <p className="font-medium">Email</p>
                <p className="bg-popover border-border truncate rounded-md border p-2 text-sm font-medium">
                  {email}
                </p>
              </>
            )}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <>
              <Skeleton className="bg-popover h-5 w-20 rounded-md" />{' '}
              <Skeleton className="bg-popover h-9 w-full rounded-md" />
            </>
          ) : (
            <>
              <p className="font-medium">Descrição</p>
              <p
                className={cn(
                  'bg-popover border-border rounded-md border p-2 text-sm font-medium',
                  !description && 'text-muted-foreground',
                )}
              >
                {description ?? 'Nenhuma descrição'}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <EditInfo>
            <CreateOrganizationForm isEditing={true} />
          </EditInfo>
          <DeleteConfirmation
            isOrg={true}
            name={name}
            onDelete={handleShutdown}
          />
        </div>
      </CardContent>
    </Card>
  )
}
