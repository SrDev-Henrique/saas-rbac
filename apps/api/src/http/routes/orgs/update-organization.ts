import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { supabaseAdmin } from '@/server/supabase-server'
import { createSlug } from '@/utils/create-slug'

function getAvatarStorageKey(urlString: string): string | null {
  const markerInPath = '/avatars/'

  try {
    const parsed = new URL(urlString)
    const path = parsed.pathname
    const idx = path.indexOf(markerInPath)
    if (idx !== -1) {
      return decodeURIComponent(path.slice(idx + markerInPath.length)).replace(
        /^\/+/,
        '',
      )
    }
  } catch {
    // ignore and try raw fallback
  }

  const raw = urlString.split('?')[0]
  const rawIdx = raw.indexOf('avatars/')
  if (rawIdx !== -1) {
    return decodeURIComponent(raw.slice(rawIdx + 'avatars/'.length)).replace(
      /^\/+/,
      '',
    )
  }

  return null
}

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Update organization details',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
            avatarUrl: z.string().nullish(),
            description: z.string().nullish(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({ slug: z.string() }),
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

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            `Você não tem permissão para atualizar esta organização.`,
          )
        }

        const currentOrganization = await prisma.organization.findUnique({
          where: {
            id: organization.id,
          },
        })

        const oldAvatarUrl = currentOrganization?.avatarUrl

        const {
          name,
          domain: rawDomain,
          shouldAttachUsersByDomain,
          avatarUrl,
          description,
        } = request.body

        const validAvatarUrl = avatarUrl ?? null

        const domain = (() => {
          const value = (rawDomain ?? '').trim().toLowerCase()
          return value.length > 0 ? value : undefined
        })()

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
              NOT: {
                id: organization.id,
              },
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
              NOT: {
                id: organization.id,
              },
            },
          })

          if (organizationWithSameName) {
            throw new BadRequestError('Organização com este nome já existe')
          }
        }

        if (validAvatarUrl && oldAvatarUrl && oldAvatarUrl !== validAvatarUrl) {
          const key = getAvatarStorageKey(oldAvatarUrl)
          if (key) {
            try {
              await supabaseAdmin.storage.from('avatars').remove([key])
            } catch (error) {
              request.log.error(
                { error, key },
                'Failed to delete avatar from storage',
              )
            }
          }
        }

        const updated = await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            domain,
            shouldAttachUsersByDomain,
            avatarUrl: validAvatarUrl,
            description,
            slug: createSlug(name),
          },
        })

        return reply.status(200).send({ slug: updated.slug })
      },
    )
}
