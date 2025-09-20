'use server'

import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'

const signInWithPasswordSchema = z.object({
  email: z.email({
    message: 'O e-mail fornecido precisa ser válido',
  }),
  password: z.string().min(8, {
    message: 'A senha fornecida precisa ter pelo menos 8 caracteres',
  }),
})

export async function SignInWithPassword(
  previousState: unknown,
  data: FormData,
) {
  const result = signInWithPasswordSchema.safeParse(Object.fromEntries(data))

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
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return { success: false, message: 'Erro ao fazer login', errors: null }
  }

  return { success: true, message: null, errors: null }
}
