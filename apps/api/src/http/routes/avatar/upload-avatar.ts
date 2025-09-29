import { auth } from '@/http/middlewares/auth'
import { FastifyInstance } from 'fastify'
import { BadRequestError } from '../_errors/bad-request-error'
import { randomUUID } from 'crypto'
import { supabaseAdmin } from '@/server/supabase-server'
import { prisma } from '@/lib/prisma'

export async function uploadAvatar(app: FastifyInstance) {
  app.register(auth).post(
    '/upload-avatar',
    {
      schema: { hide: true },
    },
    async (request, reply) => {
      try {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('Usuário não encontrado')
        }

        const mp = await (request as any).file({
          limits: { fileSize: 5 * 1024 * 1024 },
        })

        if (!mp) {
          throw new BadRequestError('Arquivo não encontrado')
        }

        if (!mp.mimetype?.startsWith('image/')) {
          throw new BadRequestError('Apenas arquivos de imagem são permitidos')
        }

        const filename = mp.filename ?? `avatar-${Date.now()}`
        const key = `avatar/${user.name ?? user.email}/${randomUUID()}-${filename}`

        const buffer = await mp.toBuffer()

        const { error: uploadError } = await supabaseAdmin.storage
          .from('avatars')
          .upload(key, buffer, {
            contentType: mp.mimetype,
            upsert: false,
          })

        if (uploadError) {
          throw new BadRequestError(uploadError.message)
        }

        const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl(key)
        const publicUrl = data?.publicUrl ?? null

        if (!publicUrl) {
          throw new BadRequestError(
            'Não foi possível obter a URL pública do avatar',
          )
        }

        return reply.status(200).send({
          avatarUrl: publicUrl,
        })
      } catch (error: any) {
        request.log.error(error)
        if (error instanceof BadRequestError) {
          return reply.status(400).send({ message: error.message })
        }
        return reply
          .status(500)
          .send({ message: error?.message ?? 'Erro interno' })
      }
    },
  )
}
