import { useGetInvites } from '@/hooks/use-get-invites'
import { AppAbility } from '@saas/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import InviteMembersDialog from './invite-members-dialog'
import Invite from './origin-ui/invite'
import { UserX2 } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

interface InviteMembersProps {
  slug: string
  permissions: AppAbility | null | undefined
}

export default function InviteMembers({
  slug,
  permissions,
}: InviteMembersProps) {
  const { data: invites, isLoading } = useGetInvites({ slug })

  const canCreateInvite = permissions?.can('create', 'Invite')

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Convites</h1>
      <div className="border-border rounded-xl border p-4">
        {canCreateInvite && (
          <Card className="bg-background border-none shadow-none">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                <Skeleton className="dark:bg-popover h-5 w-34 rounded-md" />
              </div>
            ) : (
              <CardHeader>
                <CardTitle className="text-center">Convidar Membros</CardTitle>
                <CardDescription className="text-center">
                  Clique no botão abaixo para convidar membros para sua
                  organização.
                </CardDescription>
              </CardHeader>
            )}
            <CardContent>
              <div className="flex justify-center">
                {isLoading ? (
                  <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                ) : (
                  <InviteMembersDialog org={slug} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {(invites?.invites.length ?? 0 > 0) ? (
          <Card className="bg-background mx-auto w-fit border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-center">Convites Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex max-h-[500px] flex-col items-center gap-4 overflow-y-auto px-2">
                {invites?.invites.map((invite) => (
                  <Invite
                    key={invite.id}
                    invite={invite}
                    orgSlug={slug}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-background border-none shadow-none">
            <div className="flex justify-center">
              <UserX2 size={32} className="text-muted-foreground" />
            </div>
            <CardHeader>
              <CardTitle className="text-center">
                Nenhum convite encontrado
              </CardTitle>
              <CardDescription className="text-center">
                Convide membros para sua organização e seus convites serão
                exibidos aqui.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
