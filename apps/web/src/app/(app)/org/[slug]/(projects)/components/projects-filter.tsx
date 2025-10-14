'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useId } from 'react'
import { Label } from '@/components/ui/label'
import FilterByAuthor from './filter-by-author'

interface Author {
  id: string
  name: string | null
  avatarUrl: string | null
}

export default function ProjectsFilter({
  search,
  onSearchChange,
  sort,
  onSortChange,
  author,
  onAuthorChange,
  authors,
}: {
  search: string
  onSearchChange: (value: string) => void
  sort: 'newest' | 'oldest'
  onSortChange: (value: 'newest' | 'oldest') => void
  author: string
  onAuthorChange: (value: string) => void
  authors: Author[]
}) {
  const id = useId()
  return (
    <div className="flex items-end space-x-1.5">
      <div className="relative w-full">
        <SearchIcon
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          size={18}
        />
        <Input
          placeholder="Buscar projeto..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-fit *:not-first:mt-2">
        <Label className="text-nowrap" htmlFor={id}>
          Filtrar por
        </Label>
        <Select
          value={sort}
          onValueChange={(v) => onSortChange(v as 'newest' | 'oldest')}
        >
          <SelectTrigger className="w-fit text-nowrap" id={id}>
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
            <SelectItem value="newest">Mais novos</SelectItem>
            <SelectItem value="oldest">Mais antigos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <FilterByAuthor
        authors={authors ?? []}
        value={author}
        onChange={onAuthorChange}
      />
    </div>
  )
}
