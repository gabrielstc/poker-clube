"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlayerTable } from "./PlayerTable"

type Player = {
  id: string
  name: string
}

type TournamentPlayer = {
  playerId: string
  position: number
  player: Player
}

type SelectPlayerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: Player[]
  tournamentPlayers: TournamentPlayer[]
  editPosition: number | null
  onSelectPlayer: (player: Player) => void
  onCreateNewPlayerClick: () => void
}

export function SelectPlayerModal({
  open,
  onOpenChange,
  players,
  tournamentPlayers,
  editPosition,
  onSelectPlayer,
  onCreateNewPlayerClick,
}: SelectPlayerModalProps) {
  const [search, setSearch] = useState("")

  const disabledIds = useMemo(() => {
    return tournamentPlayers.map(tp => tp.playerId)
  }, [tournamentPlayers])

  const filteredPlayers = useMemo(() => {
    return players.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [players, search])

  useEffect(() => {
    if (open) setSearch("")
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editPosition !== null
              ? `Editar jogador da posição ${editPosition}`
              : "Selecionar jogador"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            placeholder="Buscar jogador..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="mt-2 mb-2 text-right">
            <Button variant="secondary" onClick={onCreateNewPlayerClick}>
              Criar novo jogador
            </Button>
          </div>
          <PlayerTable
            players={filteredPlayers}
            actionLabel="Selecionar"
            onAction={(player) => {
              onSelectPlayer(player)
              setSearch("")
            }}
            disabledPlayerIds={disabledIds}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
