"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"

const schema = z.object({
  date: z.string(),
  type: z.enum(["ENTRADA", "SAIDA"]),
  value: z.string(),
  description: z.string().optional(),
  playerName: z.string().min(1, "Informe o nome do jogador")
})

export default function TransactionForm({ players }: { players: { id: string, name: string }[] }) {
  const [open, setOpen] = useState(false)
  const today = new Date().toISOString().split("T")[0]
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: today,
      type: "ENTRADA",
      value: "0.00"
    }
  })
  const [loading, setLoading] = useState(false)

  const [displayValue, setDisplayValue] = useState("R$ 0,00")

  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "")
    const float = (parseFloat(numeric) / 100).toFixed(2)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(parseFloat(float))
  }

  async function createPlayer(name: string) {
    // Chamada API para criar player e retornar id
    console.log("Criando jogador:", name)
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
    if (!res.ok) throw new Error("Erro ao criar jogador")
    const data = await res.json()
    return data.id // assumindo que a API retorna { id: string, name: string }
  }

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log("Dados do formulário:", data)
    setLoading(true)
    try {
      // Verifica se player existe
      let player = players.find(p => p.name.toLowerCase() === data.playerName.toLowerCase())

      let playerId = player?.id
      if (!playerId) {
        // Cria novo player
        playerId = await createPlayer(data.playerName)
      }

      // Agora cria a transação usando o playerId
      console.log("Criando transação com playerId:", playerId)
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: data.date,
          type: data.type,
          value: data.value,
          description: data.description,
          playerId
        })
      })

      setOpen(false)
      reset()
      location.reload()
    } catch (err) {
      alert("Erro ao salvar: " + err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4">Nova Transação</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Input
            type="date"
            defaultValue={today}
            {...register("date")}
          />
          <select
            {...register("type")}
            className="input border border-gray-300 rounded px-3 py-2 bg-white text-gray-900"
          >
            <option value="" disabled hidden>
              Selecione o tipo
            </option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>
          <Input
            placeholder="Valor"
            value={displayValue}
            onChange={(e) => {
              const raw = e.target.value
              const numeric = raw.replace(/\D/g, "")
              const formatted = formatCurrency(raw)
              setDisplayValue(formatted)
              setValue("value", (parseFloat(numeric) / 100).toFixed(2)) 
            }}
            inputMode="numeric"
          />
          <Input placeholder="Descrição" {...register("description")} />
          <Input
            placeholder="Nome do Jogador"
            list="players-list"
            {...register("playerName")}
            autoComplete="off"
          />
          <datalist id="players-list">
            {players.map(p => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>

          {errors.playerName && <p className="text-red-500">{errors.playerName.message}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
