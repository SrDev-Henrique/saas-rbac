import SignUpForm from '@/app/(auth)/sign-up/sign-up-form'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

export default function CreateAccountDialog({ invite }: { invite?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Criar conta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar conta</DialogTitle>
        </DialogHeader>
        <SignUpForm isDialog invite={invite} />
      </DialogContent>
    </Dialog>
  )
}
