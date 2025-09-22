import { api } from './api-client'

interface SignInWithGitHubRequest {
  code: string
}

interface SignInWithGitHubResponse {
  token: string
}

export async function signInWithGitHub({ code }: SignInWithGitHubRequest) {
  const response = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<SignInWithGitHubResponse>()

  console.log(response)

  return response
}
