import { Button } from "@/components/ui/button"

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import CreateProjectForm from "../../create-project/create-project"
import { PlusIcon } from "lucide-react"

export default function CreateProjectDialog() { 
    return (
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 size-4" />
              Novo projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Criar novo projeto</DialogTitle>
            <CreateProjectForm />
          </DialogContent>
        </Dialog>
    )
}