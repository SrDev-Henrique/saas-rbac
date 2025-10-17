import { getUser, isAuthenticated } from '@/auth/auth'
import AvatarGroup from '@/components/avatar-group'
import CreateAccountDialog from '@/components/create-account-dialog'
import SignInDialog from '@/components/sign-in-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AcceptInviteButton } from '@/components/accept-invite-button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { acceptInvite } from '@/http/accept-invite'
import { getInvite } from '@/http/get-invite'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface invitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage({ params }: invitePageProps) {
  const isUserAuthenticated = await isAuthenticated()

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
  const membersNames = members.map((member) => {
    const rawName = member.user.name
    return typeof rawName === 'string' ? rawName : 'Anônimo'
  })

  if (!author || author.name === null || !organization) return null

  let userWithSameEmail = false

  if (isUserAuthenticated) {
    const user = await getUser()
    if (user) {
      userWithSameEmail = user.email === inviteData.invite.email
    }
  }

  async function acceptInviteAction() {
    'use server'
    const cookieStore = await cookies()
    cookieStore.set('inviteId', invite.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    const { organizationSlug } = await acceptInvite({ inviteId: invite.id })

    cookieStore.delete('inviteId')

    redirect(`/org/${organizationSlug}`)
  }

  return (
    <div className="flex min-h-screen w-full flex-col justify-center space-y-4 p-4 xl:px-0">
      {userWithSameEmail && (
        <h1 className="text-center text-2xl font-bold">
          Você recebeu um convite
        </h1>
      )}
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <div className="flex w-full justify-center">
              <Avatar className="size-16">
                {author?.avatarUrl && <AvatarImage src={author.avatarUrl} />}
                <AvatarFallback>
                  {author?.name
                    ?.split(' ')
                    .map((name) => name.charAt(0).toUpperCase())
                    .join('') ?? ''}
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
          <div className="mx-auto flex w-fit gap-4">
            <Avatar className="h-15 w-15 rounded-md">
              {organization.avatarUrl && (
                <AvatarImage src={organization.avatarUrl} />
              )}
              <AvatarFallback>
                {organization.name
                  ?.split(' ')
                  .map((name) => name.charAt(0).toUpperCase())
                  .join('') ?? ''}
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
                      names={membersNames}
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
          {userWithSameEmail ? (
            <div className="flex w-full items-center justify-between">
              <form action={acceptInviteAction}>
                <AcceptInviteButton />
              </form>
              <Button size="sm" variant="default">
                Rejeitar convite
              </Button>
            </div>
          ) : (
            <div className="flex w-full max-w-xs flex-col items-center justify-between space-y-4 text-balance">
              <p className="text-muted-foreground text-center text-sm font-medium">
                Você precisa estar logado com o email{' '}
                <span className="text-chart-2">{inviteData.invite.email}</span>{' '}
                para aceitar o convite, caso não tenha uma conta com este email,
                por favor, clique em{' '}
                <span className="text-chart-2 hover:underline">
                  criar conta
                </span>
                .
              </p>
              <div className="flex w-full items-center justify-center gap-4">
                <SignInDialog
                  initialValues={{
                    email: inviteData.invite.email,
                    password: '',
                  }}
                  invite={inviteData.invite.id}
                />
                <CreateAccountDialog invite={inviteData.invite.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
