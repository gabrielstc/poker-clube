import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { name: "asc" }
    })
    return NextResponse.json(players)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao listar jogadores" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name } = data

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    // Verifica se já existe player com mesmo nome
    const existing = await prisma.player.findFirst({ where: { name } })
    if (existing) {
      return NextResponse.json({ error: "Jogador já existe" }, { status: 409 })
    }

    const player = await prisma.player.create({
      data: { name }
    })

    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar jogador" }, { status: 500 })
  }
}