import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const data = await req.json()
  const { name, date } = data

  if (!name || !date) {
    return NextResponse.json({ error: "Nome e data são obrigatórios" }, { status: 400 })
  }

  const tournament = await prisma.tournament.create({
    data: {
      name,
      date: new Date(date),
    }
  })

  return NextResponse.json(tournament, { status: 201 })
}