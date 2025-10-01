import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import CreateOrganizationForm from '../../create-org/create-organization-form'

export default function CreateOrganizationPage() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Criar Organização</SheetTitle>
        </SheetHeader>

        <CreateOrganizationForm />
      </SheetContent>
    </Sheet>
  )
}
