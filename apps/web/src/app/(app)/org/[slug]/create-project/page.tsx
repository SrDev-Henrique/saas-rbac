import Header from '@/components/header'
import CreateProjectForm from './create-project'

export default function CreateProjectPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-4 p-4 xl:px-0">
      <Header canGetProjects />
      <div className="">
        <h1>Criar Projeto</h1>
      </div>

      <CreateProjectForm />
    </div>
  )
}
