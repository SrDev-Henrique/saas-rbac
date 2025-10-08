'use client'

import React, { useEffect, useRef } from 'react'
import { CircleUserRoundIcon } from 'lucide-react'
import { useFileUpload } from '@/hooks/use-file-upload'
import { Button } from '@/components/ui/button'

type Props = {
  value?: string | null
  onChange?: (v: string | null) => void
  onFileSelected?: (file: File | null) => void
  removeFile?: boolean
  accept?: string
}

export default function FileUploaderField({
  value = null,
  onChange,
  onFileSelected,
  accept = 'image/*',
  removeFile = false,
}: Props) {
  const [state, actions] = useFileUpload({
    accept,
    initialFiles: value
      ? [
          {
            id: 'initial-avatar',
            name: 'avatar',
            size: 0,
            type: 'image/*',
            url: value,
          },
        ]
      : [],
    maxSize: 1024 * 1024 * 1, // 1MB
  })

  useEffect(() => {
    if (removeFile && state.files.length > 0) {
      state.files.slice().forEach((f) => {
        actions.removeFile(f.id)
      })
    }
  }, [removeFile, state.files, actions])

  const previewUrl = state.files[0]?.preview ?? null
  const fileName =
    state.files[0]?.file instanceof File
      ? state.files[0].file.name
      : ((state.files[0]?.file as any)?.name ?? null)

  useEffect(() => {
    const fileEntry = state.files[0]
    if (fileEntry) {
      const preview =
        fileEntry.preview ??
        (fileEntry.file instanceof File
          ? URL.createObjectURL(fileEntry.file)
          : (fileEntry.file as any).url)
      onChange?.(preview)
      onFileSelected?.(fileEntry.file instanceof File ? fileEntry.file : null)
    } else {
      onChange?.(null)
      onFileSelected?.(null)
    }

    return () => {
      const fileEntry = state.files[0]
      if (fileEntry && fileEntry.file instanceof File) {
        try {
          const url = fileEntry.preview
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url)
          }
        } catch {}
      }
    }
  }, [state.files, onChange, onFileSelected])

  return (
    <div className="mt-2 mb-2 flex flex-col items-start gap-2">
      <div className="inline-flex items-center gap-2 align-top">
        <div
          className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
          aria-label={
            previewUrl
              ? 'Preview da imagem carregada'
              : 'Avatar padrão do usuário'
          }
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview da imagem carregada"
              width={32}
              height={32}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="opacity-60" size={16} />
            </div>
          )}
        </div>

        <div className="relative inline-block">
          <Button
            type="button"
            onClick={actions.openFileDialog}
            aria-haspopup="dialog"
          >
            {fileName ? 'Alterar imagem' : 'Carregar imagem'}
          </Button>

          <input
            {...actions.getInputProps()}
            className="sr-only"
            aria-label="Upload de arquivo de imagem"
            tabIndex={-1}
          />
        </div>
      </div>

      {fileName && (
        <div className="inline-flex gap-2 text-xs">
          <p className="text-muted-foreground max-w-32 truncate" aria-live="polite">
            {fileName}
          </p>
          <button
            type="button"
            onClick={() => actions.removeFile(state.files[0]?.id)}
            className="text-destructive font-medium hover:underline"
            aria-label={`Remover ${fileName}`}
          >
            Remover
          </button>
        </div>
      )}

      <p
        aria-live="polite"
        role="region"
        className="text-muted-foreground mt-2 text-xs"
      >
        Carregue a imagem da sua organização. (Máx. 1MB)
      </p>
    </div>
  )
}
