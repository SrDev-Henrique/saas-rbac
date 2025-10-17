'use server'

import z from 'zod'
import { HTTPError } from 'ky'
import { createInvite } from '@/http/create-invite'
import { inviteMembersSchema } from './schema'

export async function createInviteAction(
  data: z.infer<typeof inviteMembersSchema>,
  orgSlug: string,
) {
  const result = inviteMembersSchema.safeParse(data)

  if (!result.success) {
    const errors = z.treeifyError(result.error)

    return { success: false, message: null, errors }
  }

  const { invites } = result.data

  async function parseHttpError(err: unknown): Promise<string> {
    if (err instanceof HTTPError) {
      try {
        const payload = (await err.response.json()) as any
        const msg = payload?.message ?? null
        if (typeof msg === 'string' && msg.length > 0) return msg
      } catch {}
      try {
        const text = await err.response.text()
        if (text) return text
      } catch {}
      return err.message ?? 'Erro ao enviar convite'
    }
    if (err && typeof err === 'object' && 'message' in err) {
      return String((err as any).message)
    }
    return 'Erro ao enviar convite'
  }

  try {
    const results = await Promise.allSettled(
      invites.map((invite) =>
        createInvite({
          email: invite.email,
          role: invite.role,
          invitedName: invite.name,
          org: orgSlug,
        }),
      ),
    )

    const fieldErrors: Record<string, string> = {}
    let numSuccessful = 0

    for (const [index, res] of results.entries()) {
      if (res.status === 'fulfilled') {
        numSuccessful++
      } else {
        fieldErrors[`invites.${index}.root`] = await parseHttpError(res.reason)
      }
    }

    const total = invites.length
    const partialSuccess = numSuccessful > 0 && numSuccessful < total
    const allSucceeded = numSuccessful === total
    const anySucceeded = numSuccessful > 0
    const allSucceededWithOnlyOneInvite = numSuccessful === 1 && total === 1

    const message = allSucceededWithOnlyOneInvite
      ? 'Convite enviado com sucesso'
      : allSucceeded
        ? 'Convites enviados com sucesso'
        : partialSuccess
          ? `${numSuccessful} convite(s) enviados, ${total - numSuccessful} falharam`
          : 'Erro ao enviar convites'

    return {
      success: anySucceeded,
      message,
      errors: Object.keys(fieldErrors).length > 0 ? fieldErrors : null,
    }
  } catch (err: unknown) {
    console.error(err)
    return {
      success: false,
      message: 'Erro ao enviar convites',
      errors: null,
    }
  }
}
