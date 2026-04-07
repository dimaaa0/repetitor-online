"use client";

import { useRef, useState } from "react";
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
  CreditCard,
  Zap,
  Info,
} from "lucide-react";
import CopyButton from "@/src/components/UI/HandleCopyButton";
import SubjectPicker from '../../../components/UI/SubjectPicker';
import AddAvatar from "@/src/components/UI/AddAvatar";


const profile = () => {

  const { user, loading, refreshUser } = useUser();
  const supabase = createClient();
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null); // Сам файл для отправки в БД
  const [previewUrl, setPreviewUrl] = useState(null); // Ссылка для отображения картинки в UI
  const fileInputRef = useRef(null); // Реф для вызова окна выбора файла


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Создаем временную ссылку для превью
    }
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
    <div className=" bg-gray-50 py-6 px-0 sm:px-4 lg:px-8">
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

          {/* Карточка: Подписка (вместо Активности) */}
          <div className="bg-white flex flex-col justify-between rounded-2xl py-6 shadow-sm border border-gray-100 p-2 pb-6 sm:p-6 md:p-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Тарифный план
              </h3>
              {/* Бейдж статуса */}
              <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter border border-green-100">
                Активен
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-medium tracking-tight leading-none">Стоимость</p>
                  <p className="text-lg font-bold text-gray-800">
                    15,000 <span className="text-xs font-medium text-gray-400">UZS / мес.</span>
                  </p>
                </div>
              </div>
              {/* Даты подписки */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-tight">Дата покупки</p>
                  <p className="font-bold text-gray-800">
                    {new Date(user.subscription_start).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-tight">Годен до</p>
                  <p className="font-bold text-blue-600">
                    {new Date(user.subscription_end).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Визуальный прогресс-бар (опционально) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                  <span>Прогресс периода</span>
                  <span>70%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: '70%' }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="space-y-8 bg-white py-6 mt-6 px-4 sm:px-8 rounded-[32px] shadow-md border border-gray-100">
          <h1 className="text-[14px] font-black  text-gray-500 uppercase tracking-[0.1em] mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Ваше объявление
          </h1>

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
