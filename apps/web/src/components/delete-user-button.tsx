'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import Toast from './toast'
import { Loader2 } from 'lucide-react'

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
        toast.custom((t) => (
          <Toast
            error={true}
            message="Erro ao deletar"
            errorMessage={err}
            onClick={() => toast.dismiss(t)}
          />
        ))
        return
      }

      router.push('/sign-in')
    } catch (err) {
      console.error(err)
      toast.custom((t) => (
        <Toast
          error={true}
          message="Erro inesperado ao deletar usuário"
          errorMessage={(err as Error).message}
          onClick={() => toast.dismiss(t)}
        />
      ))
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
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        'Deletar conta'
      )}
    </Button>
  )
}
