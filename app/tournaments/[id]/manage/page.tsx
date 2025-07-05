"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
  const params = useParams()
  const [players, setPlayers] = useState<Player[]>([])
  const [tournamentPlayers, setTournamentPlayers] = useState<TournamentPlayer[]>([])

  const [selectPlayerOpen, setSelectPlayerOpen] = useState(false)
  const [createPlayerOpen, setCreatePlayerOpen] = useState(false)
  const [editPosition, setEditPosition] = useState<number | null>(null)
  const [createPlayerLoading, setCreatePlayerLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  // Busca os dados do torneio ao carregar a página
  useEffect(() => {
    async function fetchTournament() {
      setLoading(true)
      try {
        const res = await fetch(`/api/tournaments/${params.id}`)
        if (!res.ok) throw new Error("Erro ao buscar torneio")
        const data = await res.json()

        console.log("tournamentPlayers", data.players)

        setPlayers(data.players.map((tp: { player: any }) => tp.player))
        setTournamentPlayers(
          data.players.map((tp: any) => ({
            playerId: tp.playerId,
            position: tp.position,
            player: tp.player,
          }))
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchTournament()
  }, [params.id])

  // Busca todos os players da base ao abrir o modal de seleção
  async function fetchAllPlayers() {
    try {
      const res = await fetch("/api/players")
      if (!res.ok) throw new Error("Falha ao carregar jogadores")
      const data = await res.json()
      setPlayers(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Quando modal abrir, buscar os players atualizados
  useEffect(() => {
    if (selectPlayerOpen) {
      fetchAllPlayers()
    }
  }, [selectPlayerOpen])

  const nextPosition =
    tournamentPlayers.length > 0
      ? Math.max(...tournamentPlayers.map(tp => tp.position)) + 1
      : 1

  async function handleSelectPlayer(player: Player) {
    try {
      const positionToUse = editPosition !== null ? editPosition : nextPosition

      const res = await fetch(`/api/tournaments/${params.id}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: player.id,
          position: positionToUse,
        }),
      })

      if (!res.ok) throw new Error("Erro ao adicionar jogador")

      const newTP = await res.json()

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
          {
            playerId: newTP.playerId,
            position: newTP.position,
            player: newTP.player,
          },
        ])
      }

      setSelectPlayerOpen(false)
    } catch (error) {
      alert("Erro ao adicionar jogador")
      console.error(error)
    }
  }


  function handleEditPlayer(position: number) {
    setEditPosition(position)
    setSelectPlayerOpen(true)
  }

async function handleCreatePlayer(name: string) {
  setCreatePlayerLoading(true);

  try {
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Erro ao criar jogador");

    const newPlayer: Player = await res.json();

    // Atualiza lista geral de players
    setPlayers(prev => [...prev, newPlayer]);

    // Atualiza lista do torneio para adicionar o novo jogador automaticamente
    setTournamentPlayers(prev => [
      ...prev,
      { playerId: newPlayer.id, position: nextPosition, player: newPlayer }
    ]);

    setCreatePlayerOpen(false);
  } catch (error) {
    alert("Erro ao criar jogador");
    console.error(error);
  } finally {
    setCreatePlayerLoading(false);
  }
}

  if (loading) return <p>Carregando dados do torneio...</p>

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
          .filter(tp => tp.player != null) // filter out undefined/null players
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
        players={players}  // <-- players sempre atualizado aqui
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
