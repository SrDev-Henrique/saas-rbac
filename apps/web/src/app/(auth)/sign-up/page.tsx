import SignUpForm from './sign-up-form'

export default function SignInPage() {
  return (
    <div className="flex w-full max-w-sm flex-col space-y-4">
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold">Criar conta</h1>
      </div>

      <SignUpForm />
    </div>
  )
}
