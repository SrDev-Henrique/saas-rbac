import Header from '@/components/header'
import OrganizationSettingsClient from './client'

export default async function SettingsPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div className="relative space-y-4 p-4 xl:px-0">
      <Header />
      <OrganizationSettingsClient slug={params.slug} />
    </div>
  )
}
