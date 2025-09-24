'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  avatarUrl: string
}

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/auth/profile')
      if (res.status === 401) {
        router.push('/sign-in')
        return
      }
      const json = await res.json()
      setUser(json.user)
    })()
  }, [router])

  if (!user) return <div>Carregando...</div>
  return <pre>{JSON.stringify(user, null, 2)}</pre>
}
