'use client'

import { useEffect, useId, useRef, useState, useTransition } from 'react'
import {
  CheckIcon,
  CopyIcon,
  CreditCardIcon,
  Loader2,
  Minus,
  UserIcon,
  UserRoundPlusIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { inviteMembersSchema } from '@/app/(app)/org/[slug]/members/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import z from 'zod'
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  FormControl,
} from './ui/form'
import { useSearchParams } from 'next/navigation'
import { createInviteAction } from '@/app/(app)/org/[slug]/members/actions'
import { queryClient } from '@/lib/react-query'
import RedAlert from './origin-ui/alert-red'
import EmeraldAlert from './origin-ui/alert-emerald'
import { toast } from 'sonner'
import Toast from './toast'

export default function InviteMembersDialog({ org }: { org: string }) {
  const id = useId()

  const formSchema = inviteMembersSchema
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invites: [
        {
          email: '',
          name: '',
          role: 'MEMBER',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'invites',
  })
  const [copied, setCopied] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastInputRef = useRef<HTMLInputElement>(null)

  const addField = () => {
    append({ email: '', name: '', role: 'MEMBER' })
  }

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const [{ success, message }, setFormState] = useState<{
    success: boolean
    message: string | null
  }>({
    success: false,
    message: null,
  })

  const [isLoading, startTransition] = useTransition()

  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setFormState({ success: false, message: error })
    }
  }, [searchParams])

  function onSubmit(data: z.input<typeof formSchema>) {
    startTransition(async () => {
      try {
        const state = (await createInviteAction(data, org)) as {
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

        const hasFieldErrors = Boolean(
          state?.errors &&
            typeof state.errors === 'object' &&
            !Array.isArray(state.errors) &&
            Object.keys(state.errors as Record<string, unknown>).length > 0,
        )

        if (state.success) {
          queryClient.invalidateQueries({ queryKey: ['invites', org] })
          toast.custom((t) => (
            <Toast message={state.message!} onClick={() => toast.dismiss(t)} />
          ))
        }

        if (state.success && !hasFieldErrors) {
          form.reset()
        }
      } catch (err: any) {
        setFormState({
          success: false,
          message: err?.message ?? 'Erro desconhecido',
        })
        toast.custom((t) => (
          <Toast
            error={true}
            message="Erro ao enviar convite"
            errorMessage={err?.message ?? 'Erro desconhecido'}
            onClick={() => toast.dismiss(t)}
          />
        ))
      }
    })
  }

  return (
    <Dialog
      onOpenChange={() => {
        form.reset()
        setFormState({ success: false, message: null })
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Convidar membros</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          lastInputRef.current?.focus()
        }}
      >
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <UserRoundPlusIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Convidar membros</DialogTitle>
            <DialogDescription className="text-left">
              Convidar membros para a organização.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {success === false && message && <RedAlert text={message} />}
            {success === true && message && <EmeraldAlert text={message} />}
            <div className="space-y-4">
              <div className="*:not-first:mt-2">
                <Label>Convidar via email</Label>
                <div className="space-y-3">
                  {fields.map((fieldItem, index) => (
                    <div
                      key={index}
                      className="border-border flex flex-col gap-2 rounded-md border p-2"
                    >
                      {(() => {
                        const rowError = (form.formState.errors as any)
                          ?.invites?.[index]?.root?.message
                        return rowError ? (
                          <p className="text-destructive mb-1 text-sm">
                            {String(rowError)}
                          </p>
                        ) : null
                      })()}
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col space-y-2">
                          <FormField
                            control={form.control}
                            name={`invites.${index}.email`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    id={`team-email-${index + 1}`}
                                    placeholder="exemplo@exemplo.com"
                                    type="email"
                                    {...field}
                                    ref={
                                      index === fields.length - 1
                                        ? lastInputRef
                                        : undefined
                                    }
                                    className="relative"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <div className="*:not-first:mt-2">
                              <FormField
                                control={form.control}
                                name={`invites.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                      <Input
                                        id={`team-name-${index + 1}`}
                                        placeholder="Nome"
                                        type="text"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="*:not-first:mt-2">
                              <FormField
                                control={form.control}
                                name={`invites.${index}.role`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cargo</FormLabel>
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 h-8 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
                                          <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                                          <SelectItem value="MEMBER">
                                            <UserIcon
                                              size={16}
                                              aria-hidden="true"
                                            />
                                            <span className="truncate">
                                              Membro
                                            </span>
                                          </SelectItem>
                                          <SelectItem value="BILLING">
                                            <CreditCardIcon
                                              size={16}
                                              aria-hidden="true"
                                            />
                                            <span className="truncate">
                                              Faturamento
                                            </span>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Minus size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={addField}
                className="text-sm underline hover:no-underline"
              >
                + Adicionar outro
              </button>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <p>Enviar convite{fields.length > 1 && 's'}</p>
              )}
            </Button>
          </form>
        </Form>

        <hr className="my-1 border-t" />

        <div className="*:not-first:mt-2">
          <Label htmlFor={id}>Convidar via link mágico</Label>
          <div className="relative">
            <Input
              ref={inputRef}
              id={id}
              className="pe-9"
              type="text"
              defaultValue={`https://${org}.com/members/invite`}
              readOnly
            />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopy}
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                    aria-label={copied ? 'Copiado' : 'Copiar para clipboard'}
                    disabled={copied}
                  >
                    <div
                      className={cn(
                        'transition-all',
                        copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                      )}
                    >
                      <CheckIcon
                        className="stroke-emerald-500"
                        size={16}
                        aria-hidden="true"
                      />
                    </div>
                    <div
                      className={cn(
                        'absolute transition-all',
                        copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
                      )}
                    >
                      <CopyIcon size={16} aria-hidden="true" />
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  Copiar para clipboard
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
