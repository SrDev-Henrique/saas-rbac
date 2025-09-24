import { getUser } from '@/auth/auth'
import CardAvatar from '@/components/card-avatar'
import DeleteUserButton from '@/components/delete-user-button'
import SignOutButton from '@/components/sign-out-button'

export default async function Home() {
  const user = await getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12">
      <div className="border-accent-foreground/15 rounded-3xl border p-3">
        <CardAvatar
          avatarUrl={user.avatarUrl}
          name={user.name}
          email={user.email}
        />
      </div>
      <div className="flex flex-col gap-4">
        <SignOutButton />
        <DeleteUserButton id={user.id} />
      </div>
    </div>
  )
}
