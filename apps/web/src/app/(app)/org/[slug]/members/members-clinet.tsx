'use client'

import InviteMembers from '@/components/invite-members'
import MembersList from '@/components/members-list'
import { useAbility } from '@/hooks/use-ability'
import { useGetMembers } from '@/hooks/use-get-members'
import { useGetOrganization } from '@/hooks/use-get-organization'
import { Organization, organizationSchema } from '@saas/auth'
import { useParams } from 'next/navigation'

export default function MembersClient() {
  const { slug: org } = useParams<{ slug: string }>()

  const { data: members, isLoading } = useGetMembers({ slug: org })

  const { data: organization } = useGetOrganization({ slug: org })

  const permissions = useAbility({ slug: org })
  const canInviteMembers = permissions.data?.can('invite', 'User')
  const canGetMembers = permissions.data?.can('get', 'User')

  const membersList = members?.members || []

  const organizationData = organization?.organization!

  let authOrganization: Organization | null = null

  if (organizationData) {
    authOrganization = organizationSchema.parse(organizationData)
  }

  return (
    <div className="space-y-4">
      {canInviteMembers && <InviteMembers />}
      {canGetMembers && (
        <MembersList
          members={membersList}
          isLoading={isLoading}
          org={org!}
          organization={authOrganization}
        />
      )}
    </div>
  )
}
