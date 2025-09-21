import SignInForm from './sign-in-form'

export default function SignInPage() {
  return (
    <div className="flex w-full max-w-sm flex-col space-y-4">
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold">Fazer login</h1>
      </div>

      <SignInForm />
    </div>
  )
}
