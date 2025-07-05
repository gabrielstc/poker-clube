"use client"

import { useState } from "react"
import { PlayerTable } from "./components/PlayerTable"
import { SelectPlayerModal } from "./components/SelectPlayerModal"
import { CreatePlayerModal } from "./components/CreatePlayerModal"
import { Button } from "@/components/ui/button"

type Player = {
  id: string
  name: string
}

type TournamentPlayer = {
  playerId: string
  position: number
  player: Player
}

export default function ManageTournamentPage() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Gabriel" },
    { id: "2", name: "Marcos" },
    { id: "3", name: "João" },
    { id: "4", name: "Pedro" },
    { id: "5", name: "Lucas" },
    { id: "6", name: "Thiago" },
  ])

  const [tournamentPlayers, setTournamentPlayers] = useState<TournamentPlayer[]>([
    { playerId: "1", position: 1, player: { id: "1", name: "Gabriel" } },
    { playerId: "2", position: 2, player: { id: "2", name: "Marcos" } },
  ])

  const [selectPlayerOpen, setSelectPlayerOpen] = useState(false)
  const [createPlayerOpen, setCreatePlayerOpen] = useState(false)
  const [editPosition, setEditPosition] = useState<number | null>(null)
  const [createPlayerLoading, setCreatePlayerLoading] = useState(false)

  const nextPosition =
    Math.max(0, ...tournamentPlayers.map(tp => tp.position)) + 1

  function handleSelectPlayer(player: Player) {
    if (editPosition !== null) {
      setTournamentPlayers(prev =>
        prev.map(tp =>
          tp.position === editPosition
            ? { playerId: player.id, position: editPosition, player }
            : tp
        )
      )
      setEditPosition(null)
    } else {
      setTournamentPlayers(prev => [
        ...prev,
        { playerId: player.id, position: nextPosition, player },
      ])
    }
    setSelectPlayerOpen(false)
  }

  function handleEditPlayer(position: number) {
    setEditPosition(position)
    setSelectPlayerOpen(true)
  }

  async function handleCreatePlayer(name: string) {
    setCreatePlayerLoading(true)

    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 9),
      name,
    }
    setPlayers(prev => [...prev, newPlayer])

    setCreatePlayerLoading(false)
    setCreatePlayerOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Posições do Torneio</h1>
        <Button
          onClick={() => {
            setEditPosition(null)
            setSelectPlayerOpen(true)
          }}
        >
          Adicionar jogador
        </Button>
      </div>

      <PlayerTable
        players={tournamentPlayers
          .sort((a, b) => a.position - b.position)
          .map(tp => tp.player)}
        actionLabel="Editar"
        onAction={(player) => {
          const tp = tournamentPlayers.find(t => t.playerId === player.id)
          if (tp) {
            handleEditPlayer(tp.position)
          }
        }}
      />

      <SelectPlayerModal
        open={selectPlayerOpen}
        onOpenChange={(val) => {
          if (!val) setEditPosition(null)
          setSelectPlayerOpen(val)
        }}
        players={players}
        tournamentPlayers={tournamentPlayers}
        editPosition={editPosition}
        onSelectPlayer={handleSelectPlayer}
        onCreateNewPlayerClick={() => setCreatePlayerOpen(true)}
      />

      <CreatePlayerModal
        open={createPlayerOpen}
        onOpenChange={setCreatePlayerOpen}
        onCreate={handleCreatePlayer}
        loading={createPlayerLoading}
      />
    </div>
  )
}
