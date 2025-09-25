import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Delete user',
        security: [{ bearerAuth: [] }],
        body: z.object({
          id: z.string(),
        }),
        response: {
          204: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.body

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        throw new BadRequestError('Usuário não encontrado')
      }

      await prisma.user.delete({
        where: {
          id,
        },
      })

      return reply.status(204).send({
        message: 'Usuário deletado com sucesso',
      })
    },
  )
}
