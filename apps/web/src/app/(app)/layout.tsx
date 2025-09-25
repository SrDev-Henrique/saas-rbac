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

  return <>{children}</>
}
