import SignInForm from '@/app/(auth)/sign-in/sign-in-form'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { signInFormSchema } from '@/lib/utils'
import { z } from 'zod'

export default function SignInDialog({
  initialValues,
  invite,
}: {
  initialValues?: z.infer<typeof signInFormSchema>
  invite?: string
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          Entrar com email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrar com email</DialogTitle>
        </DialogHeader>
        <SignInForm isDialog initialValues={initialValues} invite={invite} />
      </DialogContent>
    </Dialog>
  )
}
