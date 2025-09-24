'use client'

import { Input } from '@/components/ui/input'
import { SignInWithPassword } from './actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import GithubIcon from '@/lib/icons/Github'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import RedAlert from '@/components/origin-ui/alert-red'
import { signInFormSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { signInWithGitHub } from '../actions'
import { useSearchParams } from 'next/navigation'

export default function SignInForm() {
  const [{ success, message }, setFormState] = useState<{
    success: boolean
    message: string | null
  }>({
    success: false,
    message: null,
  })

  const [isPending, startTransition] = useTransition()

  const formSchema = signInFormSchema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setFormState({ success: false, message: error })
    }
  }, [searchParams])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const state = (await SignInWithPassword(data)) as {
        success: boolean
        message: string | null
        errors: unknown
      }

      setFormState({ success: state.success, message: state.message })

      if (
        state?.errors &&
        typeof state.errors === 'object' &&
        !Array.isArray(state.errors)
      ) {
        const entries = Object.entries(state.errors as Record<string, unknown>)
        for (const [field, messages] of entries) {
          const messageText = Array.isArray(messages)
            ? String(messages[0])
            : String(messages ?? '')
          // @ts-expect-error dynamic field mapping from server
          form.setError(field, { type: 'server', message: messageText })
        }
      }

      if (state.success) {
        form.reset()
      }
    })
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <Form {...form}>
        {success === false && message && <RedAlert text={message} />}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
                <Button variant="link" className="w-fit cursor-pointer" asChild>
                  <Link href="/forgot-password">Esqueceu sua senha?</Link>
                </Button>
              </FormItem>
            )}
          />
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
        </form>
      </Form>
      <Button
        variant="outline"
        className="w-full cursor-pointer"
        disabled={isPending}
        onClick={() => signInWithGitHub()}
      >
        <GithubIcon />
        Entrar com GitHub
      </Button>

      <Button
        variant="link"
        className="w-full cursor-pointer"
        asChild
        disabled={isPending}
      >
        <Link href="/sign-up">Não tenho uma conta</Link>
      </Button>
    </div>
  )
}
