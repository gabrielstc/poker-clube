"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Novo Torneio", href: "/tournaments/new" },
  { label: "Gerenciar Torneios", href: "/tournaments/manage" },
  { label: "Ranking", href: "/ranking" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 fixed">
      <h1 className="text-xl font-bold mb-8">Clube de Poker</h1>
      <nav className="flex flex-col space-y-4">
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded ${
                active ? "bg-gray-700 font-semibold" : "hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
