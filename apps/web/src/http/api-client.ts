import ky from 'ky'

function resolveBaseUrl(): string {
  const base = 'https://saas-rbac-em1b.onrender.com'
  return base.replace(/\/$/, '')
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null
  return null
}

export const api = ky.create({
  prefixUrl: resolveBaseUrl(),
  hooks: {
    beforeRequest: [
      async (request) => {
        if (typeof window === 'undefined') {
          const { cookies } = await import('next/headers')
          const cookieStore = await cookies()
          const token = cookieStore.get('token')?.value
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
        } else {
          const token = getCookie('token')
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
        }
        request.headers.set('Accept', 'application/json')
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            window.location.assign('/api/auth/sign-out')
            return
          }
          const nav = await import('next/navigation')
          nav.redirect('/api/auth/sign-out')
        }
      },
    ],
  },
  throwHttpErrors: true,
})
