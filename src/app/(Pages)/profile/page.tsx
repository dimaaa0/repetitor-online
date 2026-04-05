"use client";

import { useUser } from "../../../context/UserContext";
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Settings,
  LogOut,
  ShieldCheck,
  Calendar,
  Loader2,
} from "lucide-react";

const profile = () => {
  const { user, loading, refreshUser } = useUser();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Пользователь не найден</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1250] px-4  mx-auto">
        {/* Шапка профиля */}
        <div className="bg-white rounded-2xl  shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-24 w-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name || "Пользователь"}
              </h1>
              <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
            </div>
            <button
              onClick={() => refreshUser()}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Обновить данные"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Карточка: Аккаунт */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Безопасность
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Роль</p>
                <p className="font-medium text-gray-800">
                  {user.role || "User"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  ID Пользователя
                </p>
                <p className="font-mono text-[10px] text-gray-400 truncate">
                  {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Карточка: Даты */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Активность
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Последний вход
                </p>
                <p className="font-medium text-gray-800">
                  {new Date(user.last_sign_in_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">На сайте с</p>
                <p className="font-medium text-gray-800">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            href="/"
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 mb-4 text-red-500 hover:text-red-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Выйти из аккаунта
          </Link>
        </div>
      </div>
    </div>
  );
};

export default profile;
