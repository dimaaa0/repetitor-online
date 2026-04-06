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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1250] px-4  mx-auto">
        {/* Шапка профиля */}
        <div className="bg-white rounded-2xl  shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-24 w-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
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
              <Pencil strokeWidth={1.5} className="h-6 w-6 cursor-pointer hover:text-blue-600" />
            </button>
          </div>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Карточка: Аккаунт */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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
                <p className="font-medium text-gray-800 truncate">
                  {user.id}
                </p>
                <CopyButton textToCopy={user.id} label="ID" />
              </div>
            </div>
          </div>

          {/* Карточка: Даты */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-8">
          <h1 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Ваше объявление о репетиторстве
          </h1>

          <div className="space-y-8">
            {/* Секция профиля */}
            <div className="flex items-start gap-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 transition-all group-hover:border-blue-400 group-hover:bg-blue-50 cursor-pointer overflow-hidden">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-600 uppercase">Фото</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Предмет преподавания</label>
                  <select className="w-full bg-[#f8faff] text-blue-600 font-bold text-sm rounded-2xl px-4 py-3 border-none focus:ring-2 focus:ring-blue-100 appearance-none">
                    <option>Английский язык</option>
                    <option>Математика</option>
                    <option>Физика</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Секция цены и тегов */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Стоимость занятия</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 font-bold text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-100"
                    placeholder="120,000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">UZS / 60 МИН</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">Быстрые теги</label>
                <div className="flex flex-wrap gap-2">
                  {['NATIVE SPEAKER', 'ДЕТИ', 'ЕГЭ/ОГЭ'].map(tag => (
                    <button key={tag} className="px-4 py-2 bg-gray-50 hover:bg-blue-500 hover:text-white rounded-xl text-[10px] font-black text-gray-400 transition-all duration-200">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Секция описания */}
            <div className="bg-[#fcfdfe] rounded-2xl p-4 border border-gray-50">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block">О себе и методике</label>
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm italic text-gray-600 placeholder:text-gray-300 resize-none h-24"
                placeholder="&quot;Например: Native Speaker, сертификат CELTA, опыт подготовки к IELTS...&quot;"
              />
            </div>

            {/* Кнопка действия */}
            <button className="w-full bg-[#121926] hover:bg-black text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-gray-200 active:scale-[0.98]">
              Опубликовать объявление
            </button>
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
    </div >
  );
};

export default profile;
