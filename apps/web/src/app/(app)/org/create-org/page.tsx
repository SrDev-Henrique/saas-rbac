import Header from '@/components/header'
import CreateOrganizationForm from './create-organization-form'

export default function CreateOrganizationPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-4 p-4 xl:px-0">
      <Header />
      <div className="">
        <h1>Criar Organização</h1>
      </div>

      <CreateOrganizationForm />
    </div>
  )
}
