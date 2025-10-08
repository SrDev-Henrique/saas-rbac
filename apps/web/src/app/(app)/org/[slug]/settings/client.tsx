'use client'

import Info from '@/components/info'
import { useGetMembers } from '@/hooks/use-get-members'
import { useGetOrganization } from '@/hooks/use-get-organization'

export default function OrganizationSettingsClient({ slug }: { slug: string }) {
  const { data, isLoading } = useGetOrganization({ slug })
  const { data: membersData, isLoading: isMembersLoading } = useGetMembers({
    slug,
  })
  const organization = data?.organization
  const members = membersData?.members || []

  return (
    <div className="bg-card w-full rounded-lg py-4">
      <Info
        avatarUrl={organization?.avatarUrl!}
        name={organization?.name!}
        domain={organization?.domain!}
        description={organization?.description!}
        shouldAttachUsersByDomain={organization?.shouldAttachUsersByDomain!}
        isLoading={isLoading}
        members={members}
        isMembersLoading={isMembersLoading}
        slug={organization?.slug!}
      />
    </div>
  )
}
