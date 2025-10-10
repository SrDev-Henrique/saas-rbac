import Header from '@/components/header'
import MembersClient from './members-clinet'

export default function MembersPage() {
  return (
    <div className="space-y-4 p-4 xl:px-0">
      <Header />
      <MembersClient />
    </div>
  )
}
