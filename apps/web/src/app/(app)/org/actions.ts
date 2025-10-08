'use server'

import z from 'zod'
import { organizationSchema } from './schema'
import { HTTPError } from 'ky'
import { createOrganization } from '@/http/create-organization'
import { updateOrganization } from '@/http/update-organization'

export async function createOrganizationAction(
  data: z.infer<typeof organizationSchema>,
) {
  const result = organizationSchema.safeParse(data)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain, avatarUrl, description } =
    result.data

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

export async function updateOrganizationAction(
  data: z.infer<typeof organizationSchema>,
  org: string,
) {
  const result = organizationSchema.safeParse(data)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain, avatarUrl, description } =
    result.data

  try {
    const { slug: newSlug } = await updateOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
      description,
      org,
    })
    return {
      success: true,
      message: 'Organização editada com sucesso',
      errors: null,
      slug: newSlug,
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
      message: backendMessage ?? 'Erro ao editar organização',
      errors: null,
    }
  }
}
