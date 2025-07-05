"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Player = {
  id: string
  name: string
}

type PlayerTableProps = {
  players: Player[]
  actionLabel: string
  onAction: (player: Player) => void
  disabledPlayerIds?: string[]
}

export function PlayerTable({
  players,
  actionLabel,
  onAction,
  disabledPlayerIds = [],
}: PlayerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.length > 0 ? (
          players.map((player, index) => (
            <TableRow key={player.id}>
              <TableCell>{index + 1}º</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => onAction(player)}
                  disabled={disabledPlayerIds.includes(player.id)}
                >
                  {actionLabel}
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              Nenhum jogador encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
