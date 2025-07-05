"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { signOut } from "next-auth/react"

type Tournament = {
  id: string
  name: string
  date: string
  playersCount: number
}

type RankingItem = {
  playerId: string
  playerName: string
  points: number
}

interface DashboardClientProps {
  tournaments: Tournament[]
  stats: {
    totalTournaments: number
    totalPlayers: number
    totalEliminations: number
    avgPlayersPerTournament: number
  }
  monthlyRanking: RankingItem[]
  annualRanking: RankingItem[]
  userEmail: string
}

export default function DashboardClient({
  tournaments,
  stats,
  monthlyRanking,
  annualRanking,
  userEmail,
}: DashboardClientProps) {
  const [limitTournaments, setLimitTournaments] = useState(5)
  const [limitMonthly, setLimitMonthly] = useState(5)
  const [limitAnnual, setLimitAnnual] = useState(5)

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {userEmail && (
            <p className="text-sm text-muted-foreground">Logado como: {userEmail}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/tournaments/new">
            <Button>+ Novo Torneio</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* ... o resto do seu componente continua igual ... */}

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Torneios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.totalTournaments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Eliminações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.totalEliminations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Média por Torneio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.avgPlayersPerTournament.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jogadores únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.totalPlayers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Últimos Torneios */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Últimos torneios</h2>
        <div className="space-y-3">
          {tournaments.slice(0, limitTournaments).map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div>
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(t.date).toLocaleDateString()} • {t.playersCount} jogadores
                </p>
              </div>
              <Link href={`/tournaments/${t.id}`}>
                <Button variant="outline">Gerenciar</Button>
              </Link>
            </div>
          ))}
        </div>
        {limitTournaments < tournaments.length && (
          <div className="text-center mt-4">
            <Button onClick={() => setLimitTournaments(limitTournaments + 5)}>
              Carregar mais torneios
            </Button>
          </div>
        )}
      </div>

      {/* Ranking Mensal */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🏅 Ranking Mensal</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posição</TableHead>
              <TableHead>Jogador</TableHead>
              <TableHead>Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyRanking.slice(0, limitMonthly).map((p, i) => (
              <TableRow key={p.playerId}>
                <TableCell>{i + 1}º</TableCell>
                <TableCell>{p.playerName}</TableCell>
                <TableCell>{p.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {limitMonthly < monthlyRanking.length && (
          <div className="text-center mt-3">
            <Button onClick={() => setLimitMonthly(limitMonthly + 5)}>Carregar mais</Button>
          </div>
        )}
      </div>

      {/* Ranking Anual */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🏆 Ranking Anual</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posição</TableHead>
              <TableHead>Jogador</TableHead>
              <TableHead>Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {annualRanking.slice(0, limitAnnual).map((p, i) => (
              <TableRow key={p.playerId}>
                <TableCell>{i + 1}º</TableCell>
                <TableCell>{p.playerName}</TableCell>
                <TableCell>{p.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {limitAnnual < annualRanking.length && (
          <div className="text-center mt-3">
            <Button onClick={() => setLimitAnnual(limitAnnual + 5)}>Carregar mais</Button>
          </div>
        )}
      </div>
    </div>
  )
}
