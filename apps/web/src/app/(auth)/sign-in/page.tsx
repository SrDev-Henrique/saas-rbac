import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import GithubIcon from '@/lib/icons/Github'
import Link from 'next/link'
import { SignInWithPassword } from './actions'

export default function SignInPage() {
  return (
    <div className="flex w-full max-w-sm flex-col space-y-4">
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold">Fazer login</h1>
      </div>

      <form action={SignInWithPassword} className="w-full space-y-4">
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

        <Button type="submit" className="w-full cursor-pointer">
          Entrar com email
        </Button>

        <Separator />

        <Button
          type="submit"
          variant="outline"
          className="w-full cursor-pointer"
        >
          <GithubIcon />
          Entrar com GitHub
        </Button>

        <Separator />

        <Button variant="link" className="w-full cursor-pointer" asChild>
          <Link href="/sign-up">Não tenho uma conta</Link>
        </Button>
      </form>
    </div>
  )
}
