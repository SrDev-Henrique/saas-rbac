import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

export async function deleteMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug/members/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Delete a member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to delete this member',
          )
        }

        const member = await prisma.member.findUnique({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        if (!member) {
          throw new BadRequestError('Member not found')
        }

        await prisma.member.delete({
          where: {
            id: memberId,
            organizationId: organization.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
