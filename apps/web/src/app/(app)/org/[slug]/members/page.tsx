import Header from '@/components/header'
import MembersClient from './members-client'

export default function MembersPage() {
  return (
    <div className="relative space-y-4 p-4 pb-22 xl:px-0">
      <Header />
      <MembersClient />
    </div>
  )
}
