import { useGetInvites } from "@/hooks/use-get-invites";
import { AppAbility } from "@saas/auth";

interface InviteMembersProps {
  slug: string
  permissions: AppAbility | null | undefined
}

export default function InviteMembers({ slug, permissions }: InviteMembersProps) {
  const { data: invites, isLoading } = useGetInvites({ slug })

  const canCreateInvite = permissions?.can('create', 'Invite')

  return (
    <div>
      <h1>Invite Members</h1>
    </div>
  )
}
