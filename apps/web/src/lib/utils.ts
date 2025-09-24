import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const signInFormSchema = z.object({
  email: z.email({
    message: 'O e-mail fornecido precisa ser válido',
  }),
  password: z.string().min(1, {
    message: 'A senha é obrigatória',
  }),
})

export const signUpFormSchema = z
  .object({
    name: z.string().refine((name) => name.split(' ').length > 1, {
      message: 'Por favor digite seu nome e sobrenome',
    }),
    email: z.email({
      message: 'O e-mail fornecido precisa ser válido',
    }),
    password: z.string().min(8, {
      message: 'A senha fornecida precisa ter pelo menos 8 caracteres',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
