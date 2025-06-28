import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import TransactionForm from "@/components/transaction-form"

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: { player: true },
    orderBy: { date: "desc" }
  })

  const players = await prisma.player.findMany()

  const totalEntrada = transactions
    .filter(t => t.type === "ENTRADA")
    .reduce((a, b) => a + b.value, 0)

  const totalSaida = transactions
    .filter(t => t.type === "SAIDA")
    .reduce((a, b) => a + b.value, 0)

  const saldo = totalEntrada - totalSaida

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Transações</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Entradas</p>
            <p className="text-xl text-green-600 font-semibold">R$ {totalEntrada.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Saídas</p>
            <p className="text-xl text-red-600 font-semibold">R$ {totalSaida.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Saldo</p>
            <p className={`text-xl font-semibold ${saldo >= 0 ? "text-green-700" : "text-red-700"}`}>
              R$ {saldo.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Data</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Jogador</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-2">{t.type}</td>
                <td className="p-2">{t.player.name}</td>
                <td className={`p-2 ${t.type === "ENTRADA" ? "text-green-600" : "text-red-600"}`}>
                  R$ {t.value.toFixed(2)}
                </td>
                <td className="p-2">{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Componente do modal com o formulário */}
      <TransactionForm players={players} />
    </main>
  )
}
