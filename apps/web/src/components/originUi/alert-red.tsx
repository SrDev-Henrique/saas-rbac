import { CircleAlert } from "lucide-react"

export default function RedAlert({text}: {text: string}) {
  return (
    <div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
      <p className="text-sm">
        <CircleAlert
          className="me-3 -mt-0.5 inline-flex opacity-60"
          size={16}
          aria-hidden="true"
        />
        {text}
      </p>
    </div>
  )
}
