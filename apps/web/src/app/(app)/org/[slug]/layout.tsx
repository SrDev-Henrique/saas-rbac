import NavigationTabs from '@/components/origin-ui/tabs'

export default async function OrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative h-screen w-full">
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2">
        <NavigationTabs />
      </div>
      <main className="mx-auto w-full max-w-[1200px]">{children}</main>
    </div>
  )
}
