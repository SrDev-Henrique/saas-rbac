"use server"

export async function SignInWithEmail(data: FormData) {
  console.log(Object.fromEntries(data))
}