'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { useState } from 'react'

export default function DeleteUserButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleDelete = async () => {
    if (
      !confirm(
        'Tem certeza que deseja deletar sua conta? Esta ação é irreversível.',
      )
    )
      return

    try {
      setLoading(true)
      const res = await fetch('/api/auth/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const err = await res.text()
        alert('Erro ao deletar: ' + err)
        return
      }

      router.push('/sign-in')
    } catch (err) {
      console.error(err)
      alert('Erro inesperado ao deletar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      className="cursor-pointer"
      disabled={loading}
    >
      {loading ? 'Deletando...' : 'Deletar conta'}
    </Button>
  )
}
