"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useUser } from "../../context/UserContext";
import { useSubject } from "../../context/StudentSubjectContext";
import StudentSubjectPicker from "../UI/StudentSubjectPicker";
import { Check, CircleUser, Loader2, Search, XCircle } from "lucide-react";
import Planner from "../../components/UI/Planner";
import { useTranslations } from "next-intl";

export interface TimeSlot {
  s: string; // Start "09:00"
  e: string; // End "09:30"
}

export type WeeklyAvailability = Record<string, TimeSlot[]>;

const StudentPanel = () => {
  const { user } = useUser();
  const { selectedSubjects, setSelectedSubjects } = useSubject();
  const supabase = createClient();

  const t = useTranslations("profiles");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState("");
  const [hasAd, setHasAd] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const checkEmptyFields = (
    title: string,
    selectedSubjects: string[],
    price: string,
    description: string,
    contacts: string,
  ) => {
    if (!title || title.trim().length < 10) {
      showAlert(
        "error",
        "Пожалуйста, укажите, кого вы ищете (минимум 10 символов)",
      );
      return false;
    }
    if (selectedSubjects.length === 0) {
      showAlert("error", "Пожалуйста, выберите хотя бы один предмет");
      return false;
    }
    if (!price) {
      showAlert("error", "Пожалуйста, введите бюджет");
      return false;
    }
    if (!description || description.trim().length < 10) {
      showAlert(
        "error",
        "Пожалуйста, опишите свои цели и пожелания (минимум 10 символов)",
      );
      return false;
    }
    if (!contacts) {
      showAlert("error", "Пожалуйста, укажите ваши контакты ");
      return false;
    }
    return true;
  };

  const [announceStatus, setAnnounceStatus] = useState(false);

  useEffect(() => {
    //? Проверка на наличие объявления
    const checkAnnouncement = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("student_ads")
          .select("id") // Достаточно выбрать ID, а не всё
          .eq("user_id", user.id)
          .single();

        if (error) {
          // Если ошибка в том, что запись не найдена — просто ставим false
          if (error.code === "PGRST116") {
            setAnnounceStatus(false);
          } else {
            console.error("Ошибка при проверке:", error.details);
          }
          return;
        }

        setAnnounceStatus(!!data);
      } catch (err) {
        console.error("Непредвиденная ошибка:", err);
      }
    };

    checkAnnouncement();
  }, [user?.id, supabase]);

  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const checkBanStatus = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_banned")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Успешный исход — профиль найден, записываем статус
        setIsBanned(data.is_banned);
      } catch (error) {
        console.error("Критическая ошибка при проверке бана:", error.message);
        setIsBanned(false);
      }
    };

    checkBanStatus();
  }, [user?.id]);

  const deleteAnnouncement = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("student_ads")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        // Если ошибка в том, что запись не найдена — просто ставим false
        if (error.code === "PGRST116") {
          setAnnounceStatus(false);
        } else {
          console.error("Ошибка при проверке:", error);
        }
        return;
      }
      setAnnounceStatus(false);
      window.location.reload();
    } catch (err) {
      console.error("Не получилось удалить:", err);
    }
  };

  useEffect(() => {
    const fetchAd = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("student_ads")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setHasAd(true);
        setTitle(data.title || "");
        setPrice(data.price ? data.price.toLocaleString() : "");
        setDescription(data.description || "");
        setContacts(data.contacts || "");
        const subjectsArray = data.subject
          ? data.subject.split(",").map((subject: string) => subject.trim())
          : [];
        setSelectedSubjects(subjectsArray);
      }

      if (error && error.code !== "PGRST116") {
        console.error("Ошибка при загрузке объявления студента:", error);
      }
    };

    fetchAd();
  }, [user, supabase]);

  const handlePublishAd = async () => {
    // 1. Проверяем авторизацию сразу, чтобы избежать падения на user.id
    if (!user?.id) {
      showAlert("error", "Пользователь не авторизован");
      return;
    }

    setIsPublishing(true);

    // 2. Проверяем пустые поля
    if (
      !checkEmptyFields(title, selectedSubjects, price, description, contacts)
    ) {
      setIsPublishing(false);
      return;
    }

    // 3. Формируем данные для отправки
    const payload = {
      price: price,
      title: title,
      description: description,
      contacts: contacts,
      subject: selectedSubjects.join(", "),
    };

    try {
      const [adResponse, profileResponse] = await Promise.all([
        hasAd
          ? supabase.from("student_ads").update(payload).eq("user_id", user.id)
          : supabase
              .from("student_ads")
              .insert({ ...payload, user_id: user.id }),

        supabase.from("profiles").update({ availability }).eq("id", user.id),
      ]);

      // 5. Проверяем, не возникло ли ошибок в каком-либо из запросов
      if (adResponse.error) throw adResponse.error;
      if (profileResponse.error) throw profileResponse.error;

      // 6. Если всё прошло успешно:
      setHasAd(true);
      showAlert(
        "success",
        hasAd
          ? "Данные успешно обновлены!"
          : "Объявление успешно опубликовано!",
      );
    } catch (error: any) {
      // 7. Ловим любую ошибку из Supabase и выводим её пользователю
      console.error("Ошибка при публикации:", error);
      showAlert("error", error.message || "Ошибка при сохранении данных");
    } finally {
      setIsPublishing(false);
    }
  };

  const [availability, setAvailability] = useState<WeeklyAvailability>({});

  useEffect(() => {
    const fetchInitialSchedule = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("availability")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // data — это { availability: { ... } }. Нам нужна только внутренность.
        if (data && data.availability) {
          setAvailability(data.availability as WeeklyAvailability);
        }
      } catch (err) {
        console.error("Ошибка при загрузке расписания:", err);
      }
    };

    fetchInitialSchedule();
  }, [user?.id, supabase]);

  return (
    <div>
      <div className="space-y-8 bg-white py-6 mt-6 px-4 sm:px-8 rounded-[32px] shadow-md border border-gray-100">
        {alert && (
          <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none">
            <div
              className={`
                pointer-events-auto
                flex items-center gap-3
                px-6 py-4 rounded-2xl shadow-2xl border
                animate-in fade-in slide-in-from-top-4 duration-300
                ${
                  alert.type === "success"
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

        <h1 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>{" "}
          {t("title_your_advertisement")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 ">
            <label className="text-[11px]  flex items-center font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              {t("label_who_looking_for")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-100  border-2 border-transparent focus:border-orange-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                placeholder={t("placeholder_who_looking_for")}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              {t("label_your_budget")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                      .replace(/\D/g, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                  )
                }
                className="w-full bg-gray-100 border-2 border-transparent focus:border-orange-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                placeholder="100,000"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                UZS / 60 {t("unit_min")}
              </span>
            </div>
          </div>
        </div>

        <StudentSubjectPicker />

        <div>
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
            {t("label_learning_goals")}
          </label>
          <div className="bg-gray-100 rounded-[24px] p-5 border-2 border-transparent focus-within:border-orange-500/10 focus-within:bg-white transition-all">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] font-medium text-gray-700 placeholder:text-gray-400 resize-none h-32 leading-relaxed"
              placeholder={t("placeholder_learning_goals")}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className=" flex-col  items-center gap-2 text-sm text-gray-500">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              {t("label_contact_data")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={contacts}
                onChange={(e) => setContacts(e.target.value)}
                className="w-full bg-gray-100 border-2 border-transparent focus:border-orange-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                placeholder={t("placeholder_contact_info")}
              />
            </div>
          </div>
        </div>

        <Planner
          userId={user.id}
          initialSchedule={availability}
          editAvailability={setAvailability}
        />

        {announceStatus && !isBanned && (
          <button
            onClick={deleteAnnouncement}
            className="w-full cursor-pointer translate-y-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-[0.97] flex items-center justify-center gap-2"
          >
            {t("btn_delete_advertisement")}
          </button>
        )}

        <div className="w-full flex flex-col gap-2">
          {isBanned ? (
            // UI для забаненного пользователя
            <div className="w-full  bg-red-50 border border-red-200 text-red-700 py-4 px-5 rounded-[20px] flex items-center justify-center gap-3 shadow-sm">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                {/* Иконка щита/внимания, если есть lucide-react, иначе можно поставить обычный ⚠️ */}
                <span className="text-lg font-bold leading-none">⚠️</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm uppercase tracking-wider text-red-800">
                  {t("error_account_banned")}
                </span>
                <span className="text-xs text-red-600/90 mt-0.5">
                  {t("error_actions_restricted")}
                </span>
              </div>
            </div>
          ) : (
            // Ваш исходный UI кнопки для обычного пользователя
            <button
              onClick={handlePublishAd}
              disabled={isPublishing}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-[0.97] flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("loading")}
                </>
              ) : hasAd ? (
                <p>{t("btn_update_request")}</p>
              ) : (
                <p>{t("btn_place_request")}</p>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
