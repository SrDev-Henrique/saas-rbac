import { api } from './api-client'

interface SignUpWithPasswordRequest {
  name: string
  email: string
  password: string
}

type SignUpResponse = void

export async function signUpWithPassword({
  name,
  email,
  password,
}: SignUpWithPasswordRequest): Promise<SignUpResponse> {
  await api.post('users', {
    json: {
      name,
      email,
      password,
    },
  })
}
