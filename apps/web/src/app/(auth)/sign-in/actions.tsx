'use server'

import { z } from 'zod'

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
