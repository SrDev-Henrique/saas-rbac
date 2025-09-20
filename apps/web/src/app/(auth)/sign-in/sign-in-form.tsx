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
import RedAlert from '@/components/origin-ui/alert-red'

export default function SignInFrom() {
  const [{ success, message, errors }, formAction, isPending] = useActionState(
    SignInWithPassword,
    {
      success: false,
      message: null,
      errors: null,
    },
  )

  return (
    <form action={formAction} className="w-full space-y-4">
      {success === false && message && <RedAlert text={message} />}

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input type="text" id="email" name="email" />
        {errors?.properties?.email && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.properties.email.errors[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input type="password" id="password" name="password" />
        {errors?.properties?.password && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.properties.password.errors[0]}
          </p>
        )}
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
