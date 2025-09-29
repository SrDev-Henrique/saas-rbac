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
import { createOrganizationSchema } from './schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { createOrganizationAction } from './actions'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import RedAlert from '@/components/origin-ui/alert-red'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import FileUploaderField from '@/components/origin-ui/file-uploader'
import { uploadAvatar } from '@/lib/upload-avatar'
import EmeraldAlert from '@/components/origin-ui/alert-emerald'

export default function CreateOrganizationForm() {
  const formSchema = createOrganizationSchema

  const form = useForm<z.input<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      domain: '',
      shouldAttachUsersByDomain: false,
      avatarUrl: '',
    },
  })

  const [{ success, message }, setFormState] = useState<{
    success: boolean
    message: string | null
  }>({
    success: false,
    message: null,
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [removeAvatarFile, setRemoveAvatarFile] = useState(false)

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
        let avatarUrl: string | null = null

        if (avatarFile) {
          const result = await uploadAvatar(avatarFile)
          if ('error' in result) {
            setFormState({
              success: false,
              message: `Erro ao fazer upload da imagem: ${result.error}`,
            })
            return
          }
          avatarUrl = result.avatarUrl
        }

        const payload = {
          name: data.name,
          domain: data.domain ?? undefined,
          shouldAttachUsersByDomain: !!data.shouldAttachUsersByDomain,
          avatarUrl,
        }

        const state = (await createOrganizationAction(payload)) as {
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
          setAvatarFile(null)
          setRemoveAvatarFile(true)
          setTimeout(() => setRemoveAvatarFile(false), 50)
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
    <div className="mx-auto max-w-sm">
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
                <FormLabel>Nome da organização</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail de domínio da organização</FormLabel>
                <FormControl>
                  <Input placeholder="exemplo.com" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem da organização</FormLabel>
                <FormControl>
                  <FileUploaderField
                    value={field.value ?? null}
                    onChange={(preview) => field.onChange(preview)}
                    onFileSelected={(file) => setAvatarFile(file)}
                    accept="image/*"
                    removeFile={removeAvatarFile}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shouldAttachUsersByDomain"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>
                  <span>Anexar usuários por domínio</span>
                </FormLabel>
              </FormItem>
            )}
          />
          <p className="text-muted-foreground -mt-2 text-sm leading-tight">
            Isso irá adicionar usuários com o mesmo domínio de e-mail da
            organização automaticamente para sua organização ao fazer login.
          </p>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Criar organização'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
