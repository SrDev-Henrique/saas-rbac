import { getUser } from '@/auth/auth'
import CardAvatar from '@/components/card-avatar'
import SignOutButton from '@/components/sign-out-button'

export default async function Home() {
  const user = await getUser()

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <div className="border-accent-foreground/15 rounded-3xl border p-3">
        <CardAvatar
          avatarUrl={user.avatarUrl}
          name={user.name}
          email={user.email}
        />
      </div>
      <SignOutButton />
    </div>
  )
}
