import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export const GET = async (
  req: Request,
  context: { params: { id: string } }
) => {
  const tournamentId = context.params.id;

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        players: {
          include: { player: true },
          orderBy: { placement: "asc" },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    const players = tournament.players.map(tp => ({
      playerId: tp.playerId,
      position: tp.placement ?? 0,
      player: {
        id: tp.player.id,
        name: tp.player.name,
      },
      rebuys: tp.rebuys,
      points: tp.points,
    }));

    return NextResponse.json({
      id: tournament.id,
      name: tournament.name,
      date: tournament.date,
      players,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};


export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const tournamentId = params.id
  const body = await req.json()
  const { playerId, position } = body

  if (!playerId || !position) {
    return NextResponse.json(
      { error: "playerId e position são obrigatórios" },
      { status: 400 }
    )
  }

  try {
    const tournamentPlayer = await prisma.tournamentPlayer.create({
      data: {
        tournamentId,
        playerId,
        placement: position, // você pode ajustar o nome do campo se necessário
      },
      include: {
        player: true,
      },
    })

    return NextResponse.json(tournamentPlayer)
  } catch (error) {
    console.error("Erro ao adicionar jogador:", error)
    return NextResponse.json(
      { error: "Erro ao adicionar jogador ao torneio" },
      { status: 500 }
    )
  }
}