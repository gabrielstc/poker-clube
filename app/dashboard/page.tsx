import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const tournaments = Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    name: `Torneio ${i + 1}`,
    date: `2025-06-${String(30 - i).padStart(2, "0")}`,
    playersCount: Math.floor(Math.random() * 10) + 6,
  }))

  const totalEliminations = tournaments.reduce((acc, t) => acc + t.playersCount, 0)

  const stats = {
    totalTournaments: tournaments.length,
    totalPlayers: 20,
    totalEliminations,
    avgPlayersPerTournament: totalEliminations / tournaments.length,
  }

  const mockRanking = [
    { playerId: "p1", playerName: "Gabriel", points: 150 },
    { playerId: "p2", playerName: "Marcos", points: 120 },
    { playerId: "p3", playerName: "Léo", points: 100 },
    { playerId: "p4", playerName: "Tiago", points: 90 },
    { playerId: "p5", playerName: "Vitor", points: 85 },
    { playerId: "p6", playerName: "Juliano", points: 80 },
    { playerId: "p7", playerName: "Lucas", points: 75 },
  ]

  return (
    <DashboardClient
      tournaments={tournaments}
      stats={stats}
      monthlyRanking={mockRanking}
      annualRanking={[...mockRanking].sort((a, b) => b.points - a.points)}
      userEmail={session.user?.email || ""}
    />
  )
}
