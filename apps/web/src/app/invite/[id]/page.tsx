import AvatarGroup from '@/components/avatar-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getInvite } from '@/http/get-invite'

interface invitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage({ params }: invitePageProps) {
  const invite = await params

  const inviteData = await getInvite({ inviteId: invite.id })

  const role =
    inviteData.invite.role === 'ADMIN'
      ? 'Administrador'
      : inviteData.invite.role === 'MEMBER'
        ? 'Membro'
        : 'Faturamento'

  const author = inviteData.invite.author
  const organization = inviteData.invite.organization
  const members = organization.members

  if (!author || author.name === null || !organization) return null

  return (
    <div className="flex min-h-screen w-full flex-col justify-center space-y-4 p-4 xl:px-0">
      <h1 className="text-center text-2xl font-bold">
        Você recebeu um convite
      </h1>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <div className="flex w-full justify-center">
              <Avatar className="size-16">
                {author?.avatarUrl && <AvatarImage src={author.avatarUrl} />}
                <AvatarFallback>
                  {author.name.charAt(0).toUpperCase() +
                    author.name.charAt(1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardTitle>
          <CardDescription className="text-center">
            <span className="text-foreground font-medium hover:underline">
              {author.name}
            </span>{' '}
            convidou você para a organização{' '}
            <span className="text-foreground font-medium hover:underline">
              {organization.name}
            </span>{' '}
            com o cargo de{' '}
            <span className="text-foreground font-medium hover:underline">
              {role}
            </span>
            .
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator className="mx-auto max-w-md" />

      <div className="bg-card text-card-foreground mx-auto w-full max-w-md rounded-xl border py-6 shadow-sm">
        <div className="mx-auto flex w-fit flex-col gap-6">
          <div className="flex gap-4">
            <Avatar className="h-15 w-15 rounded-md">
              {organization.avatarUrl && (
                <AvatarImage src={organization.avatarUrl} />
              )}
              <AvatarFallback>
                {organization.name.charAt(0).toUpperCase() +
                  organization.name.charAt(1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex grow flex-col gap-2">
              <div className="space-y-1">
                <p className="text-foreground text-sm font-bold">
                  {organization.name}
                </p>
                {members && members.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AvatarGroup
                      avatarUrls={members.map(
                        (member) => member.user.avatarUrl!,
                      )}
                      size="sm"
                      shadow={false}
                    />
                    <p className="text-muted-foreground text-sm font-medium">
                      {members.length}{' '}
                      {members.length > 1 ? 'Membros' : 'Membro'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <Button
              size="sm"
              className="text-chart-2 border-chart-2 hover:text-chart-2 focus:text-chart-2"
              variant="outline"
            >
              Aceitar convite
            </Button>
            <Button size="sm" variant="default">
              Rejeitar convite
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
