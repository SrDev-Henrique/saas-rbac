import { useForm } from 'react-hook-form'
import { editProjectSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { queryClient } from '@/lib/react-query'
import { editProjectAction } from './actions'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import RedAlert from '@/components/origin-ui/alert-red'
import EmeraldAlert from '@/components/origin-ui/alert-emerald'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { initialValues } from './edit-project-dialog'

export default function EditProjectForm({
  orgSlug,
  projectId,
  initialValues,
}: {
  orgSlug: string
  projectId: string
  initialValues: initialValues
}) {
  const formSchema = editProjectSchema

  const form = useForm<z.input<typeof editProjectSchema>>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: initialValues.name ?? '',
      description: initialValues.description ?? '',
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

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setFormState({ success: false, message: error })
    }
  }, [searchParams])

  async function onSubmit(data: z.input<typeof formSchema>) {
    startTransition(async () => {
      try {
        const payload = {
          name: data.name,
          description: data.description,
        }

        const state = (await editProjectAction(
          payload,
          orgSlug,
          projectId,
        )) as {
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
          queryClient.invalidateQueries({ queryKey: ['projects', orgSlug] })
        }
      } catch (err: any) {
        setFormState({
          success: false,
          message: err?.message ?? 'Erro desconhecido',
        })
      }
    })
  }
  return (
    <div className="mx-auto w-full max-w-sm px-4">
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
              'Editar projeto'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
