import z from 'zod'

export const createOrganizationSchema = z
  .object({
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
    shouldAttachUsersByDomain: z.boolean().default(false),
    avatarUrl: z.string().nullable(),
    description: z.string().nullable(),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Domínio é obrigatório para anexar usuários por domínio',
      path: ['domain'],
    },
  )
