import Image from 'next/image'
import AvatarProfile from './origin-ui/avatar-profile'

export default function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex cursor-pointer items-center gap-3">
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
      </div>

      <div className="flex items-center gap-4">
        <AvatarProfile />
      </div>
    </div>
  )
}
