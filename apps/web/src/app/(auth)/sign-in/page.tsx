import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import GithubIcon from '@/lib/icons/Github'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <form action="" className="w-full max-w-sm space-y-4">
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

      <Button type="submit" className="w-full">
        Entrar com email
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <GithubIcon />
        Entrar com GitHub
      </Button>
    </form>
  )
}
