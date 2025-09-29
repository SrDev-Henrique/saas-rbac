'use client'

import React, { useEffect } from 'react'
import { CircleUserRoundIcon } from 'lucide-react'
import { useFileUpload } from '@/hooks/use-file-upload'
import { Button } from '@/components/ui/button'

type Props = {
  value?: string | null
  onChange?: (v: string | null) => void
  onFileSelected?: (file: File | null) => void
  accept?: string
}

export default function FileUploaderField({
  value = null,
  onChange,
  onFileSelected,
  accept = 'image/*',
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
    maxSize: 1024 * 1024 * 5, // 5MB
  })

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
  }, [state.files])

  return (
    <div className="mt-2 mb-2 flex flex-col items-start gap-2">
      <div className="inline-flex items-center gap-2 align-top">
        <div
          className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
          aria-label={
            previewUrl ? 'Preview of uploaded image' : 'Default user avatar'
          }
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview of uploaded image"
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
            aria-label="Upload image file"
            tabIndex={-1}
          />
        </div>
      </div>

      {fileName && (
        <div className="inline-flex gap-2 text-xs">
          <p className="text-muted-foreground truncate" aria-live="polite">
            {fileName}
          </p>
          <button
            type="button"
            onClick={() => actions.removeFile(state.files[0]?.id)}
            className="text-destructive font-medium hover:underline"
            aria-label={`Remove ${fileName}`}
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
        Carregue a imagem da sua organização.
      </p>
    </div>
  )
}
