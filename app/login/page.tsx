'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) router.push("/info");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-2 p-2 border"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-2 p-2 border"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
        Entrar
      </button>
    </div>
  );
}