import { uploadAvatar as uploadAvatarHttp } from '@/http/upload-avatar'

// Calls the backend multipart endpoint (via HTTP module) and returns the public URL
export async function uploadAvatar(
  file: File,
): Promise<{ avatarUrl: string } | { error: string }> {
  try {
    const result = await uploadAvatarHttp({ file })
    return { avatarUrl: result.avatarUrl }
  } catch (err: any) {
    return { error: err?.message ?? 'Erro desconhecido' }
  }
}
