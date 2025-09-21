import { FastifyInstance } from 'fastify'
import z, { ZodError } from 'zod'
import { BadRequestError } from './routes/_errors/bad-request-error'
import { UnauthorizedError } from './routes/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const erorrHandler: FastifyErrorHandler = (error, request, reply) => {
  if (
    (error as any).code === 'FST_ERR_VALIDATION' ||
    (error as any).validation
  ) {
    const validation = (error as any).validation ?? []
    return reply.status(400).send({
      statusCode: 400,
      message: 'Erro de validação',
      errors: validation,
    })
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      errors: z.treeifyError(error),
      message: 'Erro de validação',
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      statusCode: 400,
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      statusCode: 401,
      message: error.message,
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Erro interno do servidor' })
}
