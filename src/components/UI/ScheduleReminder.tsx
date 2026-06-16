"use client";

import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, X } from "lucide-react";
import { createClient } from "../../../src/utils/supabase/client"; // Проверьте этот путь под свой проект
import { useTranslations } from "next-intl";
import { useUser } from "@/src/context/UserContext";

export default function scheduleReminder() {
  const { user, loading } = useUser();
  const t = useTranslations("ScheduleReminder");
  const supabase = createClient();

  const [showReminder, setShowReminder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !user?.id) return;

    const checkReminderInterval = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("last_schedule_check")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Если даты в БД вообще нет (null), показываем напоминание сразу
        if (!data?.last_schedule_check) {
          setShowReminder(true);
          return;
        }

        const lastCheck = new Date(data?.last_schedule_check);
        const now = new Date();

        const diffTime = Math.abs(now.getTime() - lastCheck.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 4) {
          setShowReminder(true);
        }
      } catch (error) {
        console.error("Ошибка при проверке актуальности расписания:", error);
      }
    };

    checkReminderInterval();
  }, [user?.id, loading]);

  const handleConfirmSchedule = async () => {
    if (!user?.id) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ last_schedule_check: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      setShowReminder(false);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Ошибка при обновлении расписания:", err.message);
      } else {
        console.error("Неизвестная ошибка:", err);
      }
    } finally {
      // Блок finally пишется сразу после закрывающей скобки catch
      setIsSubmitting(false);
    }
  };

  if (!showReminder) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] max-w-md p-2 z-[9999] animate-fadeIn sm:left-auto sm:right-6 sm:translate-x-0">
      <div className="w-full relative bg-white border border-slate-100 text-slate-800 py-5 px-6 rounded-[24px] flex flex-col gap-4 shadow-2xl shadow-slate-200/80">
        {/* Иконка и текст */}
        <div className="flex items-start gap-3.5">
          <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 shrink-0">
            <Clock size={20} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm text-slate-900">
              {t("title")}
            </span>
            <span className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t("description")}
            </span>
          </div>
        </div>

        {/* Кнопка подтверждения */}
        <button
          onClick={handleConfirmSchedule}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 cursor-pointer text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <CheckCircle size={15} />
          {isSubmitting ? t("updating") : t("btn_confirm")}
        </button>
      </div>
    </div>
  );
}
