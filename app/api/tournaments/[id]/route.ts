import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      players: {
        include: { player: true },
        orderBy: { placement: "asc" },
      },
    },
  })

  if (!tournament) {
    return NextResponse.json({ error: "Torneio não encontrado" }, { status: 404 })
  }

  return NextResponse.json(tournament)
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: tournamentId } = params
  const { name } = await request.json()

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Nome do jogador é obrigatório" },
      { status: 400 }
    )
  }

  try {
    // Upsert do jogador (garante existência com uma query só)
    const player = await prisma.player.upsert({
      where: { name },
      update: {},
      create: { name },
    })

    // Verifica se já está no torneio
    const existing = await prisma.tournamentPlayer.findFirst({
      where: { tournamentId, playerId: player.id },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Jogador já está no torneio" },
        { status: 400 }
      )
    }

    // Conta participantes e define placement
    const count = await prisma.tournamentPlayer.count({
      where: { tournamentId },
    })

    // Cria como último eliminado
    const tournamentPlayer = await prisma.tournamentPlayer.create({
      data: {
        tournamentId,
        playerId: player.id,
        placement: count + 1,
      },
      include: { player: true },
    })

    return NextResponse.json(tournamentPlayer, { status: 201 })
  } catch (error) {
    console.error("[ADD_PLAYER]", error)
    return NextResponse.json(
      { error: "Erro ao adicionar jogador" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { playerId } = await request.json()

  if (!playerId || typeof playerId !== "string") {
    return NextResponse.json(
      { error: "playerId é obrigatório" },
      { status: 400 }
    )
  }

  // Busca os players do torneio para calcular colocação
  const tournamentPlayers = await prisma.tournamentPlayer.findMany({
    where: { tournamentId: id },
    orderBy: { placement: "asc" },
  })

  const tp = tournamentPlayers.find((tp) => tp.playerId === playerId)

  if (!tp) {
    return NextResponse.json(
      { error: "Jogador não está no torneio" },
      { status: 404 }
    )
  }

  if (tp.placement !== null) {
    return NextResponse.json(
      { error: "Jogador já eliminado" },
      { status: 400 }
    )
  }

  const eliminatedCount = tournamentPlayers.filter((tp) => tp.placement !== null)
    .length
  const totalPlayers = tournamentPlayers.length
  const placement = totalPlayers - eliminatedCount

  const updated = await prisma.tournamentPlayer.update({
    where: { id: tp.id },
    data: { placement },
  })

  return NextResponse.json(updated)
}
