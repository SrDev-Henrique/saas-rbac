import Header from '@/components/header'
import CreateProjectDialog from './components/create-project-dialog'
import ProjectsClient from './components/projects-client'

export default async function Projects({
  params,
}: {
  params: { slug: string }
}) {
  const awaitedParams = await params

  return (
    <div className="space-y-4 p-4 pb-22 xl:px-0">
      <Header slug={awaitedParams.slug} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <CreateProjectDialog />
      </div>
      <ProjectsClient orgSlug={awaitedParams.slug} />
    </div>
  )
}
