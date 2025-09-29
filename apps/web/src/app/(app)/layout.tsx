import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/sign-in')
  }

  return <div className="mx-auto max-w-[1200px]">{children}</div>
}
