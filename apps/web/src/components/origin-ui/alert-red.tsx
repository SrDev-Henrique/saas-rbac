import { CircleAlert } from 'lucide-react'

export default function RedAlert({ text }: { text: string }) {
  return (
    <div className="animate-out-5 rounded-md bg-red-300/70 px-4 py-3 text-red-700">
      <p className="text-base">
        <CircleAlert
          className="me-3 -mt-0.5 inline-flex opacity-60"
          size={18}
          aria-hidden="true"
        />
        {text}
      </p>
    </div>
  )
}
