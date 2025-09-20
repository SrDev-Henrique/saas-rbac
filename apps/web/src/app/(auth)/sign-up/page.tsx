import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import GithubIcon from '@/lib/icons/Github'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="flex w-full max-w-sm flex-col space-y-4">
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold">Criar conta</h1>
      </div>

      <form action="" className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input type="email" id="email" name="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input type="password" id="password" name="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-confirmation">Confirme sua senha</Label>
          <Input
            type="password"
            id="password-confirmation"
            name="password-confirmation"
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Criar conta
        </Button>

        <Button
          type="submit"
          variant="outline"
          className="w-full cursor-pointer"
        >
          <GithubIcon />
          Criar conta com GitHub
        </Button>

        <Separator />

        <Button variant="link" className="w-full cursor-pointer" asChild>
          <Link href="/sign-in">Já tenho uma conta</Link>
        </Button>
      </form>
    </div>
  )
}
