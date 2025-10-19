import Header from '@/components/header'
import OrganizationForm from '../org/organization-form'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function CreateOrganizationPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-4 p-4 xl:px-0">
      <Header canGetProjects />
      <div className="">
        <h1>Criar Organização</h1>
      </div>

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <OrganizationForm isEditing={false} org="" />
      </Suspense>
    </div>
  )
}
