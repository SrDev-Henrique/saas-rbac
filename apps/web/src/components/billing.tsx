'use client'

import { useGetBilling } from '@/hooks/use-get-billing'
import { usePathname } from 'next/navigation'
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Skeleton } from './ui/skeleton'

export default function Billing() {
  const pathname = usePathname()
  const parts = pathname.split('/')
  const slug = parts[2] ?? ''

  const { data, isLoading } = useGetBilling({ slug })

  const { billing } = data ?? {}

  return (
    <Card className="bg-background mx-auto max-w-3xl">
      {isLoading ? (
        <div className="flex flex-col gap-2 px-6">
          <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
          <Skeleton className="dark:bg-popover h-5 w-48 rounded-md" />
        </div>
      ) : (
        <CardHeader>
          <CardTitle>Faturamento</CardTitle>
          <CardDescription>
            Veja as informações de faturamento da sua organização.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <Table>
          <TableHeader>
            {isLoading ? (
              <TableRow>
                <TableHead>
                  <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                </TableHead>
                <TableHead
                  className="ps-5 text-right"
                  style={{ width: '120px' }}
                >
                  <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                </TableHead>
                <TableHead
                  className="ps-5 text-right"
                  style={{ width: '120px' }}
                >
                  <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                </TableHead>
              </TableRow>
            ) : (
              <TableRow>
                <TableHead>Tipo de custo</TableHead>
                <TableHead
                  className="ps-5 text-right"
                  style={{ width: '120px' }}
                >
                  Quantidade
                </TableHead>
                <TableHead
                  className="ps-5 text-right"
                  style={{ width: '120px' }}
                >
                  Subtotal
                </TableHead>
              </TableRow>
            )}
          </TableHeader>
          {isLoading ? (
            <TableBody>
              {Array.from({ length: 2 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                  </TableCell>
                  <TableCell className="ps-5 text-right">
                    <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                  </TableCell>
                  <TableCell className="ps-5 text-right">
                    <div className="flex w-fit flex-col gap-2">
                      <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                      <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>Quantidade de projetos</TableCell>
                <TableCell className="ps-5 text-right">
                  {billing?.projects.amount}
                </TableCell>
                <TableCell className="ps-5 text-right">
                  {billing?.projects.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}{' '}
                  <p className="text-muted-foreground text-xs">
                    (
                    {billing?.projects.unit.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}{' '}
                    cada)
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantidade de membros</TableCell>
                <TableCell className="ps-5 text-right">
                  {billing?.seats.amount}
                </TableCell>
                <TableCell className="ps-5 text-right">
                  {billing?.seats.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}{' '}
                  <p className="text-muted-foreground text-xs">
                    (
                    {billing?.seats.unit.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}{' '}
                    cada)
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          <TableFooter>
            {isLoading ? (
              <TableRow>
                <TableCell />
                <TableCell className="text-right">
                  <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="dark:bg-popover h-5 w-20 rounded-md" />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell />
                <TableCell className="text-right">Total</TableCell>
                <TableCell className="text-right">
                  {billing?.total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
