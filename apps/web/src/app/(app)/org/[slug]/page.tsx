import { getCurrentOrganization } from '@/auth/auth'
import Header from '@/components/header'

export default async function Projects({
  params,
}: {
  params: { slug: string }
}) {
  const currentOrganization = getCurrentOrganization({ params })
  return (
    <div className="space-y-4 p-4 xl:px-0">
      <Header slug={params.slug} />
      <main>{currentOrganization}</main>
    </div>
  )
}
