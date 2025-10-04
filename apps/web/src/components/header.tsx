import Image from 'next/image'
import AvatarProfile from './origin-ui/avatar-profile'
import OrganizationSwitcher from './origin-ui/organization-switcher'
import { Slash } from 'lucide-react'
import { ability } from '@/auth/auth'
import ThemeSwitcher from './origin-ui/theme-switcher'
import { Separator } from './ui/separator'
import Link from 'next/link'
import ProjectsSwitcher from './projects-switcher'

export default async function Header({
  slug,
  canGetProjects,
}: {
  slug?: string
  canGetProjects?: boolean
}) {
  const permissions = await ability({ slug: slug ?? '' })

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 xl:px-0">
      <div className="flex cursor-pointer items-center gap-3">
        <Link href="/">
          <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
        </Link>

        <Slash className="text-muted-foreground size-3 -rotate-[24deg]" />

        <OrganizationSwitcher />

        {(permissions?.can('get', 'Project') || canGetProjects) && (
          <>
            <Slash className="text-muted-foreground size-3 -rotate-[24deg]" />
            <ProjectsSwitcher />
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <Separator orientation="vertical" />

        <AvatarProfile />
      </div>
    </div>
  )
}
