"use client";

import { useUser } from "@/src/context/UserContext";
import Link from "next/link";
import { BookOpen, MessageCircle, Wallet } from "lucide-react";
import StudentSkeleton from "./StudentSkeletonLoader";
import { useRouter } from "next/navigation";

const StudentCard = ({
  student,
  isLoading,
  onOpenModal,
}: {
  student: any;
  isLoading?: boolean;
  onOpenModal?: () => void;
}) => {
  if (isLoading) {
    return <StudentSkeleton />;
  }



  const { user, loading } = useUser();

  const isSubscribed = user?.is_subscribed === true;

  const displayId = student.id ? String(student.id).slice(0, 8) : "";
  const router = useRouter();

  const handleAction = (e: React.MouseEvent) => {
    if (isSubscribed) {
      // Если подписан, переходим на страницу
      router.push(`/announcements/${displayId}`);
    } else {
      // Если нет, открываем модалку
      onOpenModal?.();
    }
  };

  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 p-3 pb-4 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:-translate-y-1 group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
              {student?.name?.[0] ?? "?"}
            </div>

            <div className="flex flex-col">
              {" "}
              {/* Добавили контейнер для инфо */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700 leading-none">
                  {student.name}
                </span>
                {/* user_id как маленькая кнопка-копия для админа */}
                {user?.role === "Admin" && (
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(student.user_id)
                    }
                    className="text-[10px] cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono transition-colors"
                    title="Copy ID"
                  >
                    #{student.user_id?.slice(0, 8)}...
                  </button>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Создано:{" "}
                {
                  new Date(student.postedAt)
                    .toLocaleString("ru-RU", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(",", "") // Убираем запятую между датой и временем
                    .replace(" г.", "") // Убираем " г." после года
                }
              </span>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl wrap-break-word line-clamp-2  hyphens-auto font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
            {student.title}
          </h3>

          <p className="text-slate-600 wrap-break-word leading-relaxed line-clamp-3  hyphens-auto text-justify mb-6 max-w-full">
            {student.description}
          </p>

          <div className="flex flex-wrap justify-between gap-6 items-center pt-6 border-t border-slate-50">
            <div className=" flex gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">
                    Предмет
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {student.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">
                    Бюджет
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {student.price?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col justify-end md:justify-center items-center gap-3">
              <button
                className="flex-1 md:flex-none w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleAction}
              >
                <MessageCircle size={18} />
                Откликнуться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
