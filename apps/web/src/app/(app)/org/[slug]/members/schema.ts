import { roleSchema } from '@saas/auth'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z
    .email({ message: 'Email inválido' })
    .min(1, { message: 'Email é obrigatório' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  role: roleSchema,
})

export const inviteMembersSchema = z.object({
  invites: z
    .array(inviteSchema)
    .min(1, { message: 'Inclua pelo menos um convite' }),
})
