import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select'
import { useId } from 'react'

interface Author {
  id: string
  name: string | null
  avatarUrl: string | null
}

export default function FilterByAuthor({
  authors,
  value,
  onChange,
}: {
  authors: Author[]
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <div className="w-fit text-nowrap *:not-first:mt-2">
      <Label htmlFor={id}>Por autor:</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
        >
          <SelectValue placeholder="Filtrar por autor" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          <SelectGroup>
            <SelectLabel className="ps-2">Filtrar por autor</SelectLabel>
            <SelectItem value="all">Todos</SelectItem>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                <Avatar>
                  <AvatarImage src={author.avatarUrl ?? ''} />
                  <AvatarFallback>
                    {author.name
                      ?.split(' ')
                      .map((name) => name.charAt(0).toUpperCase())
                      .join('') ?? '??'}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{author.name ?? ''}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
