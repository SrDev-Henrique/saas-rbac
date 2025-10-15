'use server'

import z from 'zod'
import { editProjectSchema } from '@/lib/utils'
import { HTTPError } from 'ky'
import { editProject } from '@/http/edit-project'

export async function editProjectAction(
  data: z.infer<typeof editProjectSchema>,
  orgSlug: string,
  projectId: string,
) {
  const result = editProjectSchema.safeParse(data)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { name, description } = result.data

  try {
    await editProject({
      name: name ?? undefined,
      description: description ?? undefined,
      org: orgSlug,
      projectId,
    })
    return {
      success: true,
      message: 'Projeto editado com sucesso',
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
      message: backendMessage ?? 'Erro ao editar projeto',
      errors: null,
    }
  }
}
