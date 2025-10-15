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
      '/invites/:inviteId/accept',
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
              organizationSlug: z.string(),
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
          select: {
            id: true,
            email: true,
            role: true,
            organizationId: true,
          },
        })

        if (!invite) {
          throw new BadRequestError('Convite não encontrado.')
        }

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('Usuário não encontrado.')
        }

        if (
          invite.email.trim().toLowerCase() !==
          (user.email ?? '').trim().toLowerCase()
        ) {
          throw new BadRequestError(
            'O email do convite não corresponde ao email do usuário.',
          )
        }

        const organization = await prisma.organization.findUnique({
          where: { id: invite.organizationId },
          select: { slug: true },
        })

        if (!organization) {
          throw new BadRequestError('Organização não encontrada.')
        }

        await prisma.$transaction(async (tx) => {
          await tx.member.upsert({
            where: {
              organizationId_userId: {
                organizationId: invite.organizationId,
                userId,
              },
            },
            update: {},
            create: {
              userId,
              organizationId: invite.organizationId,
              role: invite.role,
            },
          })
          await tx.invite.delete({
            where: {
              id: inviteId,
            },
          })
        })

        return reply.status(200).send({
          message: 'Convite aceito com sucesso',
          organizationSlug: organization.slug,
        })
      },
    )
}
