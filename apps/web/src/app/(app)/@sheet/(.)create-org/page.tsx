'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import CreateOrganizationForm from '../../create-org/create-organization-form'
import { useRouter } from 'next/navigation'

export default function CreateOrganizationPage() {
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
          <SheetTitle>Criar Organização</SheetTitle>
        </SheetHeader>

        <CreateOrganizationForm />
      </SheetContent>
    </Sheet>
  )
}
