'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function SignOutButton() {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      onClick={() => {
        router.push('/api/auth/sign-out')
      }}
      className="cursor-pointer"
    >
      Sign out
    </Button>
  )
}
