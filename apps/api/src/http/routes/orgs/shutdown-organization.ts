import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { supabaseAdmin } from '@/server/supabase-server'

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Shutdown organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            `Você não tem permissão para encerrar esta organização.`,
          )
        }

        if (organization.avatarUrl) {
          try {
            const marker = '/avatars/'
            let key: string | null = null

            try {
              const url = new URL(organization.avatarUrl)
              const path = url.pathname
              const idx = path.indexOf(marker)
              if (idx !== -1) {
                key = path.slice(idx + marker.length)
              }
            } catch {
              const raw = organization.avatarUrl.split('?')[0]
              const idx = raw.indexOf('avatars/')
              if (idx !== -1) {
                key = raw.slice(idx + 'avatars/'.length)
              }
            }

            if (key) {
              const normalizedKey = decodeURIComponent(key).replace(/^\/+/, '')
              await supabaseAdmin.storage
                .from('avatars')
                .remove([normalizedKey])
            }
          } catch (error) {
            request.log.error({ error }, 'Failed to delete avatar from storage')
          }
        }

        await prisma.$transaction([
          prisma.member.deleteMany({
            where: {
              organizationId: organization.id,
            },
          }),
          prisma.organization.delete({
            where: {
              id: organization.id,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
