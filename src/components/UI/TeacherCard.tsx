import React, { useState } from "react";
import TeacherSkeleton from "./TeacherSkeletonLoader";
import { Heart } from "lucide-react";

interface Teacher {
  id?: number | string;
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

  if (isLoading) {
    return <TeacherSkeleton />;
  }

  return (
    <div className="group bg-white rounded-3xl  border border-slate-200 p-2 pb-4 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,112,184,0.12)] hover:-translate-y-2 relative overflow-hidden flex flex-col h-full">

      <div className="flex right-2 p-2 items-center gap-1 bg-slate-500 px-3 py-2 rounded-2xl border border-slate-100">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        <span className="text-xs font-bold text-slate-600">
          {teacher.likes ?? 0}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* Аватар */}
        <div className="w-16 h-16 relative shrink-0">
          {" "}
          {teacher.avatar ? (
            <>
              <img
                src={teacher.avatar}
                alt={teacher.name ? `${teacher.name} avatar` : "teacher avatar"}
                onLoad={() => setImgLoaded(true)}
                // ДОБАВЬ w-16 h-16 и исправь синтаксис условий в className
                className={`w-16 h-16 rounded-2xl object-cover border border-slate-100 transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
              />
              {/* Пока картинка не загрузилась, показываем скелетон-заглушку прямо на её месте */}
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
        {!imgLoaded && teacher.avatar && (
          <div className="w-16 h-16 bg-slate-200 animate-pulse rounded-2xl" />
        )}

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
          <p
            className="text-sm text-slate-600 leading-relaxed hyphens-auto text-justify italic wrap-break-word line-clamp-3 md:line-clamp-4"
            style={{ hyphens: "auto", WebkitHyphens: "auto" }}
          >
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
