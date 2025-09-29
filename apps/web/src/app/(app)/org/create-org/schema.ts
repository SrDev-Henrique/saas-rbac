import z from 'zod'

export const createOrganizationSchema = z.object({
  name: z.string().min(1, {
    message: 'Nome é obrigatório',
  }),
  domain: z.string().optional(),
  shouldAttachUsersByDomain: z.boolean().optional(),
  avatarUrl: z.string().nullable(),
})
