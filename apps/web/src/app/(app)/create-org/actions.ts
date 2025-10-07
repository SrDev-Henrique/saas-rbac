'use server'

import z from 'zod'
import { createOrganizationSchema } from './schema'
import { HTTPError } from 'ky'
import { createOrganization } from '@/http/create-organization'

export async function createOrganizationAction(
  data: z.infer<typeof createOrganizationSchema>,
) {
  const result = createOrganizationSchema.safeParse(data)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain, avatarUrl, description } = result.data

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
      description,
    })
    return {
      success: true,
      message: 'Organização criada com sucesso',
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
      message: backendMessage ?? 'Erro ao criar organização',
      errors: null,
    }
  }
}
