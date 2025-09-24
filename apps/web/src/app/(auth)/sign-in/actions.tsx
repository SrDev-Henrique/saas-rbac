'use server'

import { z } from 'zod'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'
import { signInFormSchema } from '@/lib/utils'

export async function SignInWithPassword(
  data: z.infer<typeof signInFormSchema>,
) {
  const result = signInFormSchema.safeParse(data)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const data = (await err.response.json().catch(() => ({}))) as any
      const message = data?.message ?? 'Erro ao fazer login'
      const errors = data?.errors ?? null

      return { success: false, message, errors }
    }

    console.error(err)

    return {
      success: false,
      message: err instanceof Error ? err.message : 'Erro ao fazer login',
      errors: null,
    }
  }

  redirect('/')
}
