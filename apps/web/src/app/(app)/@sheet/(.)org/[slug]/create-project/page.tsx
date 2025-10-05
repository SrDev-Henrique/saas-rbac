'use client'

import CreateProjectForm from '@/app/(app)/org/[slug]/create-project/create-project'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useRouter } from 'next/navigation'

export default function CreateProjectPage() {
  const router = useRouter()
  return (
    <Sheet
      defaultOpen
      onOpenChange={(open: boolean) => {
        if (!open) router.back()
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Criar Projeto</SheetTitle>
        </SheetHeader>

        <CreateProjectForm />
      </SheetContent>
    </Sheet>
  )
}
