import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full max-w-sm flex-col space-y-4">
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold">Recuperar senha</h1>
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm">
          Digite seu e-mail abaixo para receber um link de recuperação de senha.
        </p>
      </div>

      <form action="" className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input type="email" id="email" name="email" />
        </div>

        <Separator />

        <Button variant="link" className="w-full cursor-pointer" asChild>
          <Link href="/sign-in">Voltar para login</Link>
        </Button>
      </form>
    </div>
  )
}
