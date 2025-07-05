import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { name: "asc" }, // ordena por nome
      select: {
        id: true,
        name: true,
      },
    })

    return NextResponse.json(players)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    // Cria player no banco
    const newPlayer = await prisma.player.create({
      data: { name },
    })

    return NextResponse.json(newPlayer)
  } catch (error) {
    console.error(error)
    // Pode ser erro de duplicata, etc
    return NextResponse.json({ error: "Erro interno ao criar jogador" }, { status: 500 })
  }
}