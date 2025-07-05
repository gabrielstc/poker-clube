import { getSessionServer } from "@/lib/auth";

export default async function InfoPage() {
  const session = await getSessionServer();
  if (!session) {
    return <p className="p-4">Acesso negado. Faça login.</p>;
  }
  return (
    <div className="p-4">
      Informações protegidas para {session.user?.email ?? "usuário desconhecido"}
    </div>
  );
}