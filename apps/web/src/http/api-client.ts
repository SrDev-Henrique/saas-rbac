import { env } from "@saas/env"
import ky from 'ky'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          redirect('/api/auth/sign-out')
        }
      },
    ],
  },
  throwHttpErrors: true,
})
