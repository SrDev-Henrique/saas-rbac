'use client'

import { useMemo, useState } from 'react'
import { type GetProjectsResponse } from '@/http/get-projects'
import ProjectsFilter from './projects-filter'
import ProjectsList from './projects-list'
import { useGetProjects } from '@/hooks/use-get-projects'

export default function ProjectsClient({ orgSlug }: { orgSlug: string }) {
  const { data: projects, isLoading } = useGetProjects(orgSlug)

  const [search, setSearch] = useState('')
  const [author, setAuthor] = useState('all')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  const authors = useMemo(() => {
    const list = projects?.projects ?? []
    const unique = new Map<
      string,
      GetProjectsResponse['projects'][number]['owner']
    >()
    for (const p of list) unique.set(p.owner.id, p.owner)
    return Array.from(unique.values())
  }, [projects])

  const filtered = useMemo(() => {
    const list = projects?.projects ?? []
    const s = (search || '').toLowerCase().trim()
    const a = (author || 'all').toLowerCase().trim()

    const sorted = [...list].sort((x, y) => {
      const dx = new Date(x.createdAt).getTime()
      const dy = new Date(y.createdAt).getTime()
      return sort === 'oldest' ? dx - dy : dy - dx
    })

    return sorted.filter((p) => {
      const name = (p.name || '').toLowerCase()
      const desc = (p.description || '').toLowerCase()
      const ownerOk = a === 'all' || p.owner.id.toLowerCase() === a
      const textOk = !s || name.includes(s) || desc.includes(s)
      return ownerOk && textOk
    })
  }, [projects, search, author, sort])

  return (
    <div className="space-y-4">
      <ProjectsFilter
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        author={author}
        onAuthorChange={setAuthor}
        authors={authors}
      />
      <ProjectsList projects={filtered} isLoading={isLoading} slug={orgSlug} />
    </div>
  )
}
