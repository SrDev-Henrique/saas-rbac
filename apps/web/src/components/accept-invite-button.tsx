'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function AcceptInviteButton({ className }: { className?: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="sm"
      className={cn(
        'text-chart-2 border-chart-2 hover:text-chart-2 focus:text-chart-2',
        className,
      )}
      variant="outline"
      type="submit"
      disabled={pending}
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? 'Aceitando...' : 'Aceitar convite'}
    </Button>
  )
}
