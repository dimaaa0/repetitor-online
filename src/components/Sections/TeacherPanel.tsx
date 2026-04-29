"use client";

import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useUser } from "../../context/UserContext";
import { useSubject } from "../../context/TeacherSubjectContext";

import {
  ShieldCheck,
  CreditCard,
  Loader2,
  Check,
  XCircle,
  Wallet,
} from "lucide-react";

import CopyButton from "@/src/components/UI/HandleCopyButton";
import AddAvatar from "@/src/components/UI/AddAvatar";
import SubjectPicker from "@/src/components/UI/TeacherSubjectPicker";

const TeacherPanel = () => {
  const { user, loading, refreshUser } = useUser();
  const { selectedSubjects, setSelectedSubjects } = useSubject();
  const supabase = createClient();
  const router = useRouter();

  const [subjects, setSubjects] = useState<string[]>([]); // Локальное состояние для отображения выбранных предметов
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState("");
  const [hasAd, setHasAd] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user?.id) return;

      setSubLoading(true); // 1. Включаем перед запросом

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("subscription_ends_at")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data?.subscription_ends_at) {
          const now = new Date();
          const expiry = new Date(data.subscription_ends_at);
          setIsSubscribed(expiry > now);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Ошибка при проверке подписки:", error.message);
        setIsSubscribed(false);
      } finally {
        setSubLoading(false); // 2. Выключаем ТОЛЬКО когда всё закончилось
      }
    };

    checkSubscription();
  }, [user?.id]);

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  //* СИНХРОНИЗАЦИЯ Цены ПРИ ЗАГРУЗКЕ ПРОФИЛЯ
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Удаляем всё, кроме цифр
    const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Добавляем запятые
    setPrice(formattedValue);
  };

  //* ПРОВЕРКА ПУСТОТЫ В ПОЛЯХ ПЕРЕД ПУБЛИКАЦИЕЙ
  function checkEmptyFields(
    subjects: string[],
    price: string,
    description: string,
    contacts: string,
  ) {
    if (subjects.length === 0) {
      showAlert("error", "Пожалуйста, выберите хотя бы один предмет");
      return false;
    }
    if (!price) {
      showAlert("error", "Пожалуйста, введите цену");
      return false;
    }
    if (!description || description.trim().length < 10) {
      showAlert("error", "Пожалуйста, введите описание (минимум 10 символов)");
      return false;
    }
    if (!contacts) {
      showAlert("error", "Пожалуйста, укажите ваши контакты ");
      return false;
    }
    return true;
  }

  useEffect(() => {
    const fetchAd = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        //* Заполняем поля данными из базы
        setHasAd(true);
        setPrice(data.price.toLocaleString());
        setDescription(data.description || "");
        setContacts(data.contacts || "");
        setSubjects(
          data.subject
            ? data.subject.split(", ").map((s: string) => s.trim())
            : [],
        );
      }

      if (data && data.subject) {
        // Превращаем строку из базы в массив
        const subjectsArray = data.subject
          .split(", ")
          .map((s: string) => s.trim());

        // Синхронизируем контекст с данными из БД
        setSelectedSubjects(subjectsArray);
      }

      if (error && error.code !== "PGRST116") {
        // PGRST116 — это код "запись не найдена", его игнорируем
        console.error("Ошибка при загрузке объявления:", error);
      }
    };

    fetchAd();
  }, [user, supabase]);

  //* ОБРАБОТКА ПУБЛИКАЦИИ/ОБНОВЛЕНИЯ ОБЪЯВЛЕНИЯ
  const handlePublishAd = async () => {
    setIsPublishing(true);

    if (!checkEmptyFields(selectedSubjects, price, description, contacts)) {
      setIsPublishing(false);
      return;
    }

    const payload = {
      price: price,
      description: description,
      subject: selectedSubjects.join(", "),
      contacts: contacts,
    };

    let response;

    if (hasAd) {
      response = await supabase
        .from("ads")
        .update(payload)
        .eq("user_id", user.id);
    } else {
      response = await supabase
        .from("ads")
        .insert({ ...payload, user_id: user.id });
    }

    if (response?.error) {
      showAlert("error", response.error.message);
    } else {
      setHasAd(true);
      showAlert("success", "Готово!");
    }

    setIsPublishing(false);
  };

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setSelectedSubjects([]); // Очистка, если юзер вышел
        return;
      }

      // 1. Сначала принудительно очищаем старые данные
      setSelectedSubjects([]);

      // 2. Загружаем данные из Supabase
      const { data, error } = await supabase
        .from("ads")
        .select("subject")
        .eq("user_id", user.id)
        .single();

      if (data?.subject) {
        const subjectsArray = data.subject.split(", ");
        setSelectedSubjects(subjectsArray); // Устанавливаем актуальные данные
      }
    };

    fetchUserData();
  }, [user?.id, user?.role]);

  return (
    <div>
      {alert && (
        <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none">
          <div
            className={`
        pointer-events-auto
        flex items-center gap-3
        px-6 py-4 rounded-2xl shadow-2xl border
        animate-in fade-in slide-in-from-top-4 duration-300
        ${alert.type === "success"
                ? "bg-white border-green-100 text-green-800"
                : alert.type === "error"
                  ? "bg-white border-red-100 text-red-800"
                  : "bg-white border-blue-100 text-blue-800"
              }
      `}
          >
            {/* Иконки для красоты (опционально) */}
            {alert.type === "success" && (
              <Check className="h-5 w-5 text-green-500" />
            )}
            {alert.type === "error" && (
              <XCircle className="h-5 w-5 text-red-500" />
            )}

            <span className="font-bold text-sm">{alert.message}</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div className="bg-white rounded-2xl  flex flex-col justify-between py-6 shadow-sm border border-gray-100 p-4 pb-6 sm:p-6 md:p-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Данные аккаунта
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">ID Пользователя</p>
              <p className="font-medium text-gray-800 truncate">{user.id}</p>
              <CopyButton textToCopy={user.id} label="ID" />
            </div>
          </div>
        </div>

        <div className="bg-white flex flex-col justify-between rounded-2xl py-6 shadow-sm border border-gray-100 p-4 pb-6 sm:p-6 md:p-8">
          {/* Верхняя часть: Заголовок и Статус */}
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Тарифный план
            </h3>
            {!subLoading ? (
              <span
                className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter border transition-colors ${isSubscribed
                    ? "bg-green-50 text-green-600 border-green-100"
                    : "bg-red-50 text-red-600 border-red-100"
                  }`}
              >
                {isSubscribed ? "Активен" : "Не активен"}
              </span>
            ) : (
              /* Скелетон в размер бейджа */
              <div className="w-[60px] h-[25px] bg-gray-100 animate-pulse rounded-lg border border-gray-200" />
            )}
          </div>

          {/* Блок с ценой в стиле скрина */}
          <div className="flex items-center gap-4 mb-6">
            {/* Иконка в закругленном боксе */}
            <div className="bg-green-100 p-3 rounded-2xl border border-green-100/50">
              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>

            {/* Текстовая часть */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-0.5">
                Стоимость в месяц
              </span>
              <div className="text-xl font-medium text-gray-900 leading-none">
                20,000 <span className="text-xl">UZS</span>
              </div>
            </div>
          </div>

          {/* Даты оплаты */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
            {/* Левая колонка */}
            <div className="flex  flex-row items-end h-full gap-2 justify-center pl-4">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide mb-0.5">
                Оплачено
              </p>
              <p className="text-sm font-medium text-gray-700">08.04.2026</p>
            </div>

            {/* Правая колонка */}
            <div className="flex  flex-row items-end h-full gap-2 justify-center pl-4">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide mb-0.5">
                Истекает
              </p>
              <p className="text-sm font-medium text-gray-700">08.05.2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 bg-white py-6 mt-6 px-4 sm:px-8 rounded-[32px] shadow-md border border-gray-100">
        <h1 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] mb-8 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Ваше
          объявление
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              Стоимость занятия
            </label>
            <div className="relative">
              <input
                type="string"
                value={price}
                className="w-full bg-gray-100 border-2 border-transparent focus:border-blue-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                placeholder="100,000"
                onChange={handlePriceChange}
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                UZS / 60 МИН
              </span>
            </div>
          </div>
        </div>

        <SubjectPicker />

        <div>
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
            О себе и методике
          </label>
          <div className="bg-gray-100 rounded-[24px] p-5 border-2 border-transparent focus-within:border-blue-500/10 focus-within:bg-white transition-all">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] font-medium text-gray-700 placeholder:text-gray-400 resize-none h-32 leading-relaxed"
              placeholder="Например: Ваши сертификаты, опыт работы, особенности методики и т.д."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className=" flex-col  items-center gap-2 text-sm text-gray-500">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              Контактные данные
            </label>
            <div className="relative">
              <input
                type="text"
                value={contacts}
                onChange={(e) => setContacts(e.target.value)}
                className="w-full bg-gray-100 border-2 border-transparent focus:border-orange-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                placeholder="Например: Номер телефона, Telegram, WhatsApp или email"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handlePublishAd}
            disabled={isPublishing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-[0.97] flex items-center justify-center gap-2"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Загрузка...
              </>
            ) : hasAd ? (
              "Сохранить изменения"
            ) : (
              "Опубликовать объявление"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
