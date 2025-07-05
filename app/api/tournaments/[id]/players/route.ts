import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const tournamentId = params.id

  try {
    const tournamentPlayers = await prisma.tournamentPlayer.findMany({
      where: { tournamentId },
      include: { player: true },
      orderBy: { placement: "asc" },
    })

    const players = tournamentPlayers.map(tp => ({
      playerId: tp.playerId,
      position: tp.placement ?? 0,
      player: {
        id: tp.player.id,
        name: tp.player.name,
      },
      rebuys: tp.rebuys,
      points: tp.points,
    }))

    return NextResponse.json(players)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tournamentId = params.id

  try {
    const body = await request.json()
    const { playerId, position } = body

    if (!playerId) {
      return NextResponse.json({ error: "playerId é obrigatório" }, { status: 400 })
    }

    // Se position não for enviado, você pode definir uma posição padrão, ex: última posição + 1
    let placement = position

    if (!placement) {
      // buscar a maior posição atual para esse torneio e somar 1
      const lastPlayer = await prisma.tournamentPlayer.findFirst({
        where: { tournamentId },
        orderBy: { placement: "desc" },
      })
      placement = lastPlayer ? ((lastPlayer.placement ?? 0) + 1) : 1
    }

    // Criar ou atualizar o player no torneio
    // Verifica se já existe um player nessa posição ou se o player já está no torneio
    // Você pode ajustar a lógica conforme o seu modelo

    // Vamos criar a entrada
    const created = await prisma.tournamentPlayer.create({
      data: {
        tournamentId,
        playerId,
        placement,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao adicionar jogador ao torneio" }, { status: 500 })
  }
}
