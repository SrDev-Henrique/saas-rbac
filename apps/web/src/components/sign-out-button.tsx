'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { LogOutIcon } from 'lucide-react'

export default function SignOutButton() {
  const router = useRouter()
  return (
    <div
      onClick={() => {
        router.push('/api/auth/sign-out')
      }}
      className="flex cursor-pointer items-center gap-2"
    >
      <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
      <span>Logout</span>
    </div>
  )
}
