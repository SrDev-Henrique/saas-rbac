// NOTE: Do not import '@saas/env' in browser code; use process.env.NEXT_PUBLIC_API_URL

interface UploadAvatarRequest {
  file: File
}

type UploadAvatarResponse = {
  avatarUrl: string
}

export async function uploadAvatar({
  file,
}: UploadAvatarRequest): Promise<UploadAvatarResponse> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL
  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_API_URL is not set')
  }
  const formData = new FormData()
  formData.append('file', file, file.name)

  const res = await fetch(`${apiBase}/upload-avatar`, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type; the browser will set multipart boundary
    credentials: 'include',
    headers: await buildAuthHeader(),
  })

  if (!res.ok) {
    const data = await safeJson(res)
    throw new Error(data?.message ?? 'Failed to upload avatar')
  }

  return (await res.json()) as UploadAvatarResponse
}

async function buildAuthHeader(): Promise<Record<string, string> | undefined> {
  try {
    // In the browser, read token from cookies; on server this will be undefined
    const token = getCookie('token')
    return token ? { Authorization: `Bearer ${token}` } : undefined
  } catch {
    return undefined
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift() || null
  return null
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json()
  } catch {
    return null
  }
}
