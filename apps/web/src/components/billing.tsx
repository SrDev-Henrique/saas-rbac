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

export default function Billing() {
  const pathname = usePathname()
  const parts = pathname.split('/')
  const slug = parts[2] ?? ''

  const { data } = useGetBilling({ slug })

  const { billing } = data ?? {}

  return (
    <Card className="bg-background mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Faturamento</CardTitle>
        <CardDescription>
          Veja as informações de faturamento da sua organização.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de custo</TableHead>
              <TableHead className="ps-5 text-right" style={{ width: '120px' }}>
                Quantidade
              </TableHead>
              <TableHead className="ps-5 text-right" style={{ width: '120px' }}>
                Subtotal
              </TableHead>
            </TableRow>
          </TableHeader>
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
          <TableFooter>
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
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
