import React, { useState, useEffect } from "react";
import TeacherSkeleton from "./TeacherSkeletonLoader";
import { Check, Heart, XCircle } from "lucide-react";
import { createClient } from "../../../src/utils/supabase/client";

const supabase = createClient();

interface Teacher {
  id: number | string; // ID обязателен для работы лайков
  name?: string;
  surname?: string;
  subject?: string;
  description?: string;
  likes?: number;
  price?: string;
  avatar?: string;
}

interface TeacherCardProps {
  teacher: Teacher;
  isLoading?: boolean;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  isLoading = false,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [likesCount, setLikesCount] = useState(teacher.likes ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Проверяем, лайкнул ли текущий пользователь этого учителя при загрузке
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      // 1. Получаем текущего пользователя
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 2. Запрашиваем актуальное кол-во лайков именно для этого учителя
      // Это защитит от ситуации, если данные в пропсах устарели
      const { data: adData } = await supabase
        .from("ads")
        .select("likes")
        .eq("id", teacher.id)
        .single();

      if (adData) setLikesCount(adData.likes);

      // 3. Проверяем, лайкал ли этот пользователь данную карточку
      if (user) {
        const { data: likeData } = await supabase
          .from("ads_likes")
          .select("id")
          .eq("ad_id", teacher.id)
          .eq("user_id", user.id)
          .maybeSingle(); // Используем maybeSingle, чтобы не было ошибки, если лайка нет

        setIsLiked(!!likeData);
      }
    };

    if (teacher.id) fetchCurrentStatus();
  }, [teacher.id]);

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return showAlert("error", "Войдите, чтобы ставить лайки");

    setIsProcessing(true);

    // Optimistic UI
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      if (!prevLiked) {
        await supabase
          .from("ads_likes")
          .insert({ ad_id: teacher.id, user_id: user.id });
      } else {
        await supabase
          .from("ads_likes")
          .delete()
          .eq("ad_id", teacher.id)
          .eq("user_id", user.id);
      }
    } catch (error) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <TeacherSkeleton />;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 p-2 pb-4 sm:p-6 md:p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,112,184,0.12)] hover:-translate-y-2 relative overflow-hidden flex flex-col h-full">
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
      <div className="flex justify-end">
        <button
          onClick={handleLike}
          disabled={isProcessing}
          className={`flex items-center cursor-pointer gap-1 mb-2 p-2 rounded-xl transition duration-300 ${
            isLiked ? "bg-rose-50" : "bg-slate-50 hover:bg-blue-50"
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? "text-rose-500 fill-rose-500" : "text-slate-400"
            }`}
          />
          <span
            className={`text-xs font-bold ${isLiked ? "text-rose-600" : "text-slate-600"}`}
          >
            {likesCount}
          </span>
        </button>
      </div>

      {/* ... остальной ваш код аватара и описания ... */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 relative shrink-0">
          {teacher.avatar ? (
            <>
              <img
                src={teacher.avatar}
                alt={`${teacher.name} avatar`}
                onLoad={() => setImgLoaded(true)}
                className={`w-16 h-16 rounded-2xl object-cover border border-slate-100 transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
              {!imgLoaded && (
                <div className="absolute inset-0 w-16 h-16 bg-slate-200 animate-pulse rounded-2xl" />
              )}
            </>
          ) : (
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
              <span className="text-white text-xl font-bold">
                {teacher.name ? teacher.name[0].toUpperCase() : "?"}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg leading-tight">
            {teacher.name ?? "Преподаватель"} {teacher.surname ?? ""}
          </h3>
          <p className="text-blue-600 text-sm font-semibold mt-1 inline-block bg-blue-50 px-2 py-0.5 rounded-md">
            {teacher.subject ?? "Предмет не указан"}
          </p>
        </div>
      </div>

      <div className="p-4 bg-slate-100 rounded-2xl mb-6 grow">
        <div className="p-2 bg-slate-100 rounded-2xl mb-2 grow overflow-hidden">
          <p className="text-sm text-slate-600 leading-relaxed hyphens-auto text-justify italic min-h-[107px] wrap-break-word line-clamp-4 md:line-clamp-5">
            &quot;{teacher.description ?? "Описание пока недоступно."}&quot;
          </p>
        </div>
      </div>

      <div className="mt-auto pt-5 border-t border-slate-50 flex justify-between items-center">
        <div>
          <span className="text-2xl font-black text-slate-900">
            {teacher.price ?? "—"}
          </span>
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-tighter">
            за 60 минут
          </span>
        </div>
        <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all cursor-pointer">
          Выбрать
        </button>
      </div>
    </div>
  );
};

export default TeacherCard;
