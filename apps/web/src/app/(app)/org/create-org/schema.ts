import z from 'zod'

export const createOrganizationSchema = z.object({
  name: z.string().min(1, {
    message: 'Nome é obrigatório',
  }),
  domain: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) {
          const domainRegex =
            /^(?=.{1,253}$)(?!-)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/
          return domainRegex.test(value)
        }
        return true
      },
      {
        message: 'Domínio inválido',
      },
    ),
  shouldAttachUsersByDomain: z.boolean().optional(),
  avatarUrl: z.string().nullable(),
})
