import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { roleSchema } from '@saas/auth'

export async function getInviteDetails(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Get invite details',
        params: z.object({
          inviteId: z.uuid(),
        }),
        response: {
          200: z.object({
            invite: z.object({
              id: z.uuid(),
              createdAt: z.date(),
              invitedName: z.string(),
              role: roleSchema,
              email: z.email(),
              organization: z.object({
                name: z.string(),
                avatarUrl: z.url().nullable(),
                slug: z.string(),
                members: z.array(
                  z.object({
                    user: z.object({
                      avatarUrl: z.url().nullable(),
                      name: z.string().nullable(),
                    }),
                  }),
                ),
              }),
              author: z
                .object({
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                  id: z.uuid(),
                })
                .nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { inviteId } = request.params

      const invite = await prisma.invite.findUnique({
        where: {
          id: inviteId,
        },
        select: {
          id: true,
          invitedName: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          organization: {
            select: {
              name: true,
              avatarUrl: true,
              slug: true,
              members: {
                select: {
                  user: {
                    select: {
                      avatarUrl: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      if (!invite) {
        throw new BadRequestError('Convite não encontrado.')
      }

      return reply.send({ invite })
    },
  )
}
