import Image from 'next/image'
import AvatarProfile from './origin-ui/avatar-profile'
import OrganizationSwitcher from './origin-ui/organization-switcher'
import { Slash } from 'lucide-react'
import { ability } from '@/auth/auth'

export default async function Header({ slug }: { slug?: string }) {
  const permissions = await ability({ slug: slug ?? '' })

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex cursor-pointer items-center gap-3">
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />

        <Slash className="text-muted-foreground size-3 -rotate-[24deg]" />

        <OrganizationSwitcher />

        <Slash className="text-muted-foreground size-3 -rotate-[24deg]" />

        {permissions?.can('get', 'Project') && <p>Projects</p>}
      </div>

      <div className="flex items-center gap-4">
        <AvatarProfile />
      </div>
    </div>
  )
}
