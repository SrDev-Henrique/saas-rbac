'use client'

import { MoonIcon, SunIcon } from 'lucide-react'

import { Toggle } from '@/components/ui/toggle'
import { useTheme } from 'next-themes'

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div>
      <span className="sr-only">Alterar tema</span>
      <Toggle
        variant="outline"
        className="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent"
        pressed={resolvedTheme === 'dark'}
        onPressedChange={() =>
          setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
        }
        aria-label={`mudar para modo ${resolvedTheme === 'dark' ? 'claro' : 'escuro'}`}
      >
        {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
        <MoonIcon
          size={16}
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  )
}
