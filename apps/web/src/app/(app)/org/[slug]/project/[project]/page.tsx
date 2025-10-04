import Header from '@/components/header'

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const awaitedParams = await params

  return (
    <div className="space-y-4 p-4 xl:px-0">
      <Header slug={awaitedParams.slug} />
      <main>
        <h1>Projeto</h1>
      </main>
    </div>
  )
}
