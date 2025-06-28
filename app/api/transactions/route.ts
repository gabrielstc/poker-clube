import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const data = await req.json()

  const transaction = await prisma.transaction.create({
    data: {
      date: new Date(data.date),
      type: data.type,
      value: parseFloat(data.value),
      description: data.description,
      playerId: data.playerId
    }
  })

  return NextResponse.json(transaction)
}
