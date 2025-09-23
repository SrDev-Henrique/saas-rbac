import { getUser } from '@/auth/auth'
import SignOutButton from "@/components/sign-out-button"

export default async function Home() {
  const user = await getUser()

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <SignOutButton />
    </div>
  )
}
