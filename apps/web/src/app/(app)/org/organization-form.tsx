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
import { organizationSchema } from './schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { createOrganizationAction, updateOrganizationAction } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import RedAlert from '@/components/origin-ui/alert-red'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import FileUploaderField from '@/components/origin-ui/file-uploader'
import { uploadAvatar } from '@/lib/upload-avatar'
import EmeraldAlert from '@/components/origin-ui/alert-emerald'
import { queryClient } from '@/lib/react-query'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Toast from '@/components/toast'

export default function OrganizationForm({
  isEditing = false,
  initialData,
  org,
}: {
  isEditing: boolean
  initialData?: z.input<typeof organizationSchema>
  org: string
}) {
  const formSchema = organizationSchema

  const router = useRouter()

  const form = useForm<z.input<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      domain: initialData?.domain ?? '',
      shouldAttachUsersByDomain:
        initialData?.shouldAttachUsersByDomain ?? false,
      avatarUrl: initialData?.avatarUrl ?? '',
      description: initialData?.description ?? '',
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
        } else if (initialData?.avatarUrl) {
          avatarUrl = initialData.avatarUrl
        }

        const normalizedDomain = (() => {
          const raw = (data.domain ?? '').trim().toLowerCase()
          return raw.length > 0 ? raw : undefined
        })()

        const payload = {
          name: data.name,
          domain: normalizedDomain,
          shouldAttachUsersByDomain: !!data.shouldAttachUsersByDomain,
          avatarUrl,
          description: data.description,
        }

        const state = (await (isEditing
          ? updateOrganizationAction(payload, org)
          : createOrganizationAction(payload))) as {
          success: boolean
          message: string | null
          errors: unknown
          slug?: string
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

        if (state.success && isEditing) {
          const nextSlug = state.slug ?? org

          queryClient.invalidateQueries({
            queryKey: ['organization', nextSlug],
          })
          if (nextSlug && nextSlug !== org) {
            queryClient.removeQueries({ queryKey: ['organization', org] })
          }
          router.push(`/org/${nextSlug}/settings`)
          router.refresh()
        }

        if (state.success) {
          form.reset()
          setAvatarFile(null)
          setRemoveAvatarFile(true)
          setTimeout(() => setRemoveAvatarFile(false), 50)
          queryClient.invalidateQueries({ queryKey: ['organizations'] })
          toast.custom((t) => (
            <Toast
              message={state.message!}
              onClick={() => toast.dismiss(t)}
              action={true}
              href={`/org/${org}`}
              actionLabel="Ver organização"
            />
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
            message="Erro ao criar organização"
            errorMessage={(err as Error).message}
            onClick={() => toast.dismiss(t)}
          />
        ))
      }
    })
  }
  return (
    <div className={cn('mx-auto max-w-sm px-4', isEditing && 'w-full px-0')}>
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição da organização</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEditing ? (
              'Editar organização'
            ) : (
              'Criar organização'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
