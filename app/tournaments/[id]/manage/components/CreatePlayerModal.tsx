"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type CreatePlayerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string) => void
  loading: boolean
}

export function CreatePlayerModal({ open, onOpenChange, onCreate, loading }: CreatePlayerModalProps) {
  const [newPlayerName, setNewPlayerName] = useState("")

  function handleSubmit() {
    if (!newPlayerName.trim()) {
      alert("Informe o nome do jogador")
      return
    }
    onCreate(newPlayerName.trim())
    setNewPlayerName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar novo jogador</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Input
            placeholder="Nome do jogador"
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            disabled={loading}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setNewPlayerName("")
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
