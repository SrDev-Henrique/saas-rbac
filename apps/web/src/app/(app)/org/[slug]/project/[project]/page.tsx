import Header from '@/components/header'
import ProjectClientPage from "./project-client-page"

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const awaitedParams = await params

  return (
    <div className="relative space-y-4 p-4 xl:px-0">
      <Header slug={awaitedParams.slug} />
      <ProjectClientPage slug={awaitedParams.slug} />
    </div>
  )
}
