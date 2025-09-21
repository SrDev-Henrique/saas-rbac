import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (await isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {children}
    </div>
  )
}
