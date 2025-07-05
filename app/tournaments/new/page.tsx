"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewTournamentPage() {
  const [name, setName] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const router = useRouter()

  const handleSubmit = async () => {
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date })
    })

    if (!res.ok) {
      alert("Erro ao criar torneio")
      return
    }

    const data = await res.json()
    // redireciona para a tela de gerenciamento do torneio
    router.push(`/tournaments/${data.id}/manage`)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Novo Torneio</h1>
      <Input placeholder="Nome do torneio" value={name} onChange={e => setName(e.target.value)} />
      <Input type="date" className="mt-2" value={date} onChange={e => setDate(e.target.value)} />
      <Button className="mt-4" onClick={handleSubmit}>Criar</Button>
    </div>
  )
}