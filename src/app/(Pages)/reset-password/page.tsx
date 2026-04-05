"use client";
import { useState } from "react";
import { createClient } from "../../../utils/supabase/client"; // проверь путь к своему клиенту
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert("Ошибка обновления: " + error.message);
    } else {
      alert("Пароль успешно изменен!");
      router.push("/"); // перекидываем на главную после успеха
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Новый пароль</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Введите новый пароль"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all"
          >
            {loading ? "Обновление..." : "СОХРАНИТЬ ПАРОЛЬ"}
          </button>
        </form>
      </div>
    </div>
  );
}