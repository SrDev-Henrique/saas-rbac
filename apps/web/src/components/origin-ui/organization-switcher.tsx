import { getOrganizations } from '@/http/get-organizations'
import OrganizationSwitcherClient from '../organization-switcher-client'

export default async function OrganizationSwitcher() {
  const { organizations } = await getOrganizations()

  return (
    <div>
      <OrganizationSwitcherClient organizations={organizations} />
    </div>
  )
}
