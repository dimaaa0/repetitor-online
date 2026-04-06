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
  Pencil,
} from "lucide-react";
import CopyButton from "@/src/components/UI/HandleCopyButton";

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
    <div className=" bg-gray-50 py-12 px-0 sm:px-4 lg:px-8">
      <div className="max-w-[1250] px-2 sm:px-6  mx-auto">
        {/* Шапка профиля */}
        <div className="bg-white rounded-2xl  shadow-sm border border-gray-100 p-2 pb-4 sm:p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-24 w-24 mt-4 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col min-[400px]:flex-row min-[400px]:gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name || "Пользователь"}
                </h1>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.surname}
                </h1>
              </div>
              <p className="text-gray-500 mt-2 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
            </div>
            <button
              onClick={() => refreshUser()}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Обновить данные"
            >
              <Pencil
                strokeWidth={1.5}
                className="h-6 w-6 cursor-pointer hover:text-blue-600"
              />
            </button>
          </div>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Карточка: Аккаунт */}
          <div className="bg-white rounded-2xl py-6 shadow-sm border border-gray-100 p-2 pb-6 sm:p-6 md:p-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Данные аккаунта
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Роль</p>
                <p className="font-medium text-gray-800 ">
                  {user.role || "User"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  ID Пользователя
                </p>
                <p className="font-medium text-gray-800 truncate">{user.id}</p>
                <CopyButton textToCopy={user.id} label="ID" />
              </div>
            </div>
          </div>

          {/* Карточка: Даты */}
          <div className="bg-white rounded-2xl py-6 shadow-sm border border-gray-100 p-2 pb-6 sm:p-6 md:p-8">
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

        <div className="space-y-8 bg-white py-6 mt-6 px-4 rounded-[32px] shadow-sm shadow-blue-900/5 border border-gray-50">
          <h1 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Ваше объявление
          </h1>
          {/* Секция профиля */}
          <div className="flex items-start gap-6 flex-col sm:flex-row">
            <div className="relative group">
              <div className="w-24 h-24 bg-gray-50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 transition-all group-hover:border-blue-500 group-hover:bg-blue-50 cursor-pointer overflow-hidden">
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-600 uppercase tracking-tighter">
                  Фото
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                  Предмет преподавания
                </label>
                <div className="relative flex items-center ">
                  <select className="w-full bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold text-base rounded-2xl pl-4 pr-12 py-4 border-none focus:ring-2 focus:ring-blue-500/20 appearance-none transition-colors cursor-pointer">
                    <option>Английский язык</option>
                    <option>Математика</option>
                    <option>Физика</option>
                  </select>
                  <div className=" absolute right-2.5 pointer-events-none text-blue-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {/* Кастомная стрелочка для селекта */}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
                Стоимость занятия
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 placeholder:text-gray-300 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  placeholder="100,000"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  UZS / 60 МИН
                </span>
              </div>
            </div>
          </div>

          {/* Секция описания */}
          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              О себе и методике
            </label>
            <div className="bg-gray-50 rounded-[24px] p-5 border-2 border-transparent focus-within:border-blue-500/10 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] font-medium text-gray-700 placeholder:text-gray-400 resize-none h-32 leading-relaxed"
                placeholder="Например: Опыт работы, владение языком, опыт подготовки учеников к экзаменам..."
              />
            </div>
          </div>

          {/* Кнопка действия */}
          <div className="pt-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.97]">
              Опубликовать объявление
            </button>
          </div>
        </div>
      <div className="mt-10 flex justify-end">
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
