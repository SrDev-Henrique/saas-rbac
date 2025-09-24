'use server'

import { z } from 'zod'
import { signUpFormSchema } from '@/lib/utils'
import { signUpWithPassword } from '@/http/sign-up'
import { HTTPError } from 'ky'
import { redirect } from 'next/navigation'

export async function SignUpAction(data: z.infer<typeof signUpFormSchema>) {
  const result = signUpFormSchema.safeParse(data)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  let message = null

  try {
    await signUpWithPassword({ name, email, password })
    message = 'Usuário criado com sucesso'
  } catch (err) {
    if (err instanceof HTTPError) {
      const data = (await err.response.json().catch(() => ({}))) as any
      const message = data?.message ?? 'Erro ao criar conta'
      const errors = data?.errors ?? null

      return { success: false, message, errors }
    }

    console.error(err)

    return { success: false, message: 'Erro ao criar conta', errors: null }
  }

  redirect('/sign-in')
}
