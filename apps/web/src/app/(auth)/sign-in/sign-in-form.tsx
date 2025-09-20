'use client'

import { Input } from '@/components/ui/input'
import { SignInWithPassword } from './actions'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import GithubIcon from '@/lib/icons/Github'
import Link from 'next/link'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'

export default function SignInFrom() {
  const [state, formAction, isPending] = useActionState(
    SignInWithPassword,
    null,
  )

  return (
    <form action={formAction} className="w-full space-y-4">
      {state && <p>{state}</p>}

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input type="password" id="password" name="password" />

        <Link
          href="/forgot-password"
          className="text-foreground text-xs font-medium hover:underline"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Entrar com email'
        )}
      </Button>

      <Separator />

      <Button
        type="submit"
        variant="outline"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        <GithubIcon />
        Entrar com GitHub
      </Button>

      <Separator />

      <Button
        variant="link"
        className="w-full cursor-pointer"
        asChild
        disabled={isPending}
      >
        <Link href="/sign-up">Não tenho uma conta</Link>
      </Button>
    </form>
  )
}
