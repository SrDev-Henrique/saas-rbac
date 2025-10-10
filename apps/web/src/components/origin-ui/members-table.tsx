'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Member } from '../members-list'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { ArrowLeftRight, CrownIcon, UserMinusIcon } from 'lucide-react'
import { useAbility } from '@/hooks/use-ability'
import { Organization } from '@saas/auth'
import { removeMember } from '@/http/remove-member'
import DeleteConfirmation from './delete-confirmation'
import { useState } from 'react'
import TransferConfirmation from './transfer-confirmation'
import { useGetMembership } from '@/hooks/use-get-membership'
import { queryClient } from '@/lib/react-query'

export default function MembersTable({
  members,
  isLoading,
  org,
  organization,
}: {
  members: Member[]
  isLoading: boolean
  org: string
  organization: Organization | null
}) {
  const permissions = useAbility({ slug: org })

  const { data: membership } = useGetMembership({ slug: org })

  const [isDeleting, setIsDeleting] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)

  let currentOrganization: Organization | null = null

  if (organization) {
    currentOrganization = organization
  }

  const canTransferOwnership = permissions.data?.can(
    'transfer_ownership',
    currentOrganization!,
  )
  const canRemoveMember = permissions.data?.can('delete', 'User')

  async function handleRemoveMember(orgSlug: string, memberId: string) {
    try {
      setIsDeleting(true)
      await removeMember({ slug: orgSlug, memberId })
      setIsDeleting(false)
      queryClient.invalidateQueries({ queryKey: ['members', org] })
    } catch (error) {
      alert(error)
      setIsDeleting(false)
    }
  }

  return (
    <div>
      {isLoading ? (
        <Card className="bg-background min-h-[300px] px-2">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <Skeleton className="bg-popover h-5 w-20 rounded-md" />
                </TableHead>
                <TableHead>
                  <Skeleton className="bg-popover h-5 w-20 rounded-md" />
                </TableHead>
                <TableHead>
                  <Skeleton className="bg-popover h-5 w-20 rounded-md" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="bg-popover size-9 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">
                          <Skeleton className="bg-popover h-5 w-32 rounded-md" />
                        </div>
                        <span className="text-muted-foreground mt-0.5 text-xs">
                          <Skeleton className="bg-popover h-5 w-20 rounded-md" />
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="bg-popover h-5 w-20 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="bg-popover h-5 w-20 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="bg-popover h-5 w-16 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="bg-popover h-5 w-16 rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="bg-background p-2">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((item) => (
                <TableRow key={item.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={item.avatarUrl} />
                        <AvatarFallback>
                          {item.name.charAt(0).toUpperCase() +
                            item.name.charAt(1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {item.name}{' '}
                          {item.userId === membership?.membership.userId && (
                            <span className="text-muted-foreground text-xs">
                              (você)
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground mt-0.5 text-xs">
                          @{item.name?.toLowerCase().replace(/\s+/g, '')}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge>
                      {item.role.toLowerCase() === 'admin' ? (
                        <>
                          <CrownIcon className="size-3" /> Admin
                        </>
                      ) : (
                        'Membro'
                      )}
                    </Badge>
                  </TableCell>
                  {canTransferOwnership && (
                    <TableCell
                      className={
                        item.userId === currentOrganization!.ownerId
                          ? 'hidden'
                          : ''
                      }
                    >
                      <TransferConfirmation
                        Icon={<ArrowLeftRight />}
                        name={item.name}
                        onTransfer={() => {}}
                        isTransferring={isTransferring}
                      />
                    </TableCell>
                  )}
                  {canRemoveMember && (
                    <TableCell
                      className={
                        item.userId === currentOrganization!.ownerId
                          ? 'hidden'
                          : ''
                      }
                    >
                      <DeleteConfirmation
                        size="sm"
                        Icon={<UserMinusIcon />}
                        isMember
                        name={item.name}
                        onDelete={() => handleRemoveMember(org, item.id)}
                        isDeleting={isDeleting}
                        setIsDeleting={setIsDeleting}
                        disabled={isDeleting}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
