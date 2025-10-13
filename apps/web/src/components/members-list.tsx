import { Organization, Role } from '@saas/auth'
import MembersTable from './origin-ui/members-table'

export interface Member {
  userId: string
  name: string
  avatarUrl: string
  email: string
  role: Role
  id: string
}

export default function MembersList({
  members,
  isLoading,
  org,
  organization,
}: {
  members: Member[]
  isLoading: boolean
  org: string
  organization: Organization | null
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Membros</h1>
      <MembersTable
        members={members}
        isLoading={isLoading}
        org={org}
        organization={organization}
      />
    </div>
  )
}
