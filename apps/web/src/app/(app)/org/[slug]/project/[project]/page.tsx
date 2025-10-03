import Header from '@/components/header'

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params

  return (
    <div className="space-y-4 p-4 xl:px-0">
      <Header slug={slug} />
      <main>
        <h1>Projeto</h1>
      </main>
    </div>
  )
}
