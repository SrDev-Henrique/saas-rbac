import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { createSlug } from '@/utils/create-slug'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Create a new organization',
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              message: z.string(),
              organizationId: z.uuid(),
            }),
          },
          body: z.object({
            name: z.string(),
            domain: z.string().optional(),
            shouldAttachUsersByDomain: z.boolean().default(false),
            avatarUrl: z.string().nullish(),
          }),
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const {
          name,
          domain: rawDomain,
          shouldAttachUsersByDomain,
          avatarUrl,
        } = request.body

        const domain = (() => {
          const value = (rawDomain ?? '').trim().toLowerCase()
          return value.length > 0 ? value : undefined
        })()

        if (domain) {
          const organizationByDomain = await prisma.organization.findUnique({
            where: {
              domain,
            },
          })

          if (organizationByDomain) {
            throw new BadRequestError('Organização com este domínio já existe')
          }
        }

        if (name) {
          const organizationWithSameName = await prisma.organization.findFirst({
            where: {
              name,
            },
          })

          if (organizationWithSameName) {
            throw new BadRequestError('Organização com este nome já existe')
          }
        }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug: createSlug(name),
            domain,
            shouldAttachUsersByDomain,
            avatarUrl,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        return reply.status(201).send({
          message: 'Organização criada com sucesso',
          organizationId: organization.id,
        })
      },
    )
}
