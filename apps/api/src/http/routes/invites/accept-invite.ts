import { auth } from '@/http/middlewares/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:invieId/accept',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Accept an invite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            inviteId: z.uuid(),
          }),
          response: {
            200: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params
        const userId = await request.getCurrentUserId()

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
          include: {
            organization: true,
          },
        })

        if (!invite) {
          throw new BadRequestError('Invite not found.')
        }

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('User not found.')
        }

        if (invite.email !== user.email) {
          throw new BadRequestError('Invite email does not match user email.')
        }

        await prisma.$transaction([
          prisma.member.create({
            data: {
              userId,
              organizationId: invite.organizationId,
              role: invite.role,
            },
          }),
          prisma.invite.delete({
            where: {
              id: inviteId,
            },
          }),
        ])

        return reply.status(200).send({
          message: 'Invite accepted successfully',
        })
      },
    )
}
