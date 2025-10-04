'use server'

import z from 'zod'
import { createProjectSchema } from './schema'
import { HTTPError } from 'ky'
import { createProject } from '@/http/create-project'

export async function createProjectAction(
  data: z.infer<typeof createProjectSchema>,
  orgSlug: string,
) {
  const result = createProjectSchema.safeParse(data)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { name, description } = result.data

  try {
    await createProject({
      name,
      description,
      org: orgSlug,
    })
    return {
      success: true,
      message: 'Projeto criado com sucesso',
      errors: null,
    }
  } catch (err: unknown) {
    console.error(err)
    let backendMessage: string | null = null
    if (err instanceof HTTPError) {
      try {
        const payload = (await err.response.json()) as any
        backendMessage = payload?.message ?? null
      } catch {}
    }
    return {
      success: false,
      message: backendMessage ?? 'Erro ao criar projeto',
      errors: null,
    }
  }
}
