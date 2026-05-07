"use client";

import { useState } from "react";
import { createClient } from "../../../../../utils/supabase/client";
import { useUser } from "../../../../../context/UserContext";
import { Check, XCircle } from "lucide-react";

export default function CommentForm({
  adId,
  userId,
}: {
  adId: number;
  userId: string | undefined;
}) {
  const [commentContent, setCommentContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const supabase = createClient();

  const { user } = useUser();

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const postComment = async () => {
    // 1. Базовые проверки
    if (!user?.id) {
      showAlert("error", "Войдите, чтобы оставить отзыв");
      return;
    }
    if (!commentContent.trim()) {
      showAlert("error", "Введите текст отзыва");
      return;
    }

    setPublishing(true);

    try {
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
        ad_id: adId,
        content: commentContent.trim(),
      });

      if (error) {
        // 2. Обработка конкретных ошибок Supabase/Postgres
        if (error.code === "23505") {
          showAlert("error", "Вы уже оставили отзыв к этому объявлению!");
        } else if (error.code === "42501") {
          showAlert("error", "У вас нет прав для выполнения этого действия");
        } else {
          showAlert("error", "Ошибка при отправке отзыва");
          console.error("Supabase error:", error);
        }
        return; // Прерываем выполнение, если есть ошибка
      }

      // 3. Успешный сценарий
      setCommentContent("");
      showAlert("success", "Отзыв успешно отправлен");

      // Опционально: обновляем страницу, чтобы пользователь увидел свой коммент
      // router.refresh();
    } catch (err) {
      // 4. Обработка непредвиденных ошибок (проблемы с сетью и т.д.)
      showAlert("error", "Произошла непредвиденная ошибка");
      console.error("Unexpected error:", err);
    } finally {
      setTimeout(() => setPublishing(false), 3000);
    }
  };

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  return (
    <div className="bg-slate-50/50 p-4 md:p-6 rounded-[2rem] border border-slate-200">
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
      <h3 className="text-sm font-bold text-slate-700 mb-4 px-1 uppercase tracking-wider">
        Оставить свой отзыв
      </h3>
      <div className="space-y-4">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Поделитесь вашим впечатлением от обучения..."
          className="w-full min-h-[120px] p-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none text-slate-700 resize-none"
        />
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
          <button
            onClick={postComment}
            disabled={publishing}
            className="  flex justify-center w-[200px] py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200 cursor-pointer disabled:opacity-50"
          >
            {publishing ? "Отправка..." : "Отправить отзыв"}
          </button>
        </div>
      </div>
    </div>
  );
}
