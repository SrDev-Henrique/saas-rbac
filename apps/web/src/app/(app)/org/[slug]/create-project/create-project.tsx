'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createProjectSchema } from './schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import RedAlert from '@/components/origin-ui/alert-red'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import EmeraldAlert from '@/components/origin-ui/alert-emerald'
import { queryClient } from '@/lib/react-query'
import { createProjectAction } from './actions'
import { Textarea } from '@/components/ui/textarea'
import { useAbility } from '@/hooks/use-ability'
import { toast } from 'sonner'
import Toast from '@/components/toast'

export default function CreateProjectForm() {
  const formSchema = createProjectSchema

  const form = useForm<z.input<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const [{ success, message }, setFormState] = useState<{
    success: boolean
    message: string | null
  }>({
    success: false,
    message: null,
  })

  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()

  const pathname = usePathname()

  const slug = pathname.split('/')[2]

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setFormState({ success: false, message: error })
    }
  }, [searchParams])

  const abilityQuery = useAbility({ slug })

  async function onSubmit(data: z.input<typeof formSchema>) {
    startTransition(async () => {
      try {
        const payload = {
          name: data.name,
          description: data.description,
        }

        const state = (await createProjectAction(payload, slug)) as {
          success: boolean
          message: string | null
          errors: unknown
        }

        setFormState({ success: state.success, message: state.message })

        if (
          state?.errors &&
          typeof state.errors === 'object' &&
          !Array.isArray(state.errors)
        ) {
          const entries = Object.entries(
            state.errors as Record<string, unknown>,
          )
          for (const [field, messages] of entries) {
            const messageText = Array.isArray(messages)
              ? String(messages[0])
              : String(messages ?? '')
            // @ts-expect-error dynamic field mapping from server
            form.setError(field, { type: 'server', message: messageText })
          }
        }

        if (state.success) {
          form.reset()
          queryClient.invalidateQueries({ queryKey: ['projects', slug] })
          toast.custom((t) => (
            <Toast message={state.message!} onClick={() => toast.dismiss(t)} />
          ))
        }
      } catch (err: any) {
        setFormState({
          success: false,
          message: err?.message ?? 'Erro desconhecido',
        })
        toast.custom((t) => (
          <Toast
            error={true}
            message="Erro ao criar projeto"
            errorMessage={(err as Error).message}
            onClick={() => toast.dismiss(t)}
          />
        ))
      }
    })
  }
  return (
    <div className="mx-auto w-full max-w-sm px-4">
      {abilityQuery.data?.can('create', 'Project') ? (
        <Form {...form}>
          {success === false && message && <RedAlert text={message} />}
          {success === true && message && <EmeraldAlert text={message} />}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do projeto</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do projeto</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending || !form.formState.isValid}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Criar projeto'
              )}
            </Button>
          </form>
        </Form>
      ) : abilityQuery.isLoading ? null : (
        <RedAlert text="Você não tem permissão para criar projetos" />
      )}
    </div>
  )
}
