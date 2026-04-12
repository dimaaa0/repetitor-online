import { Check, Loader2, Search, XCircle } from "lucide-react";
import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import SubjectPicker from "./TeacherSubjectPicker";

const StudentPanel = () => {
  const { user } = useUser();

  const [subjects, setSubjects] = useState<string[]>([]); // Локальное состояние для отображения выбранных предметов
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [hasAd, setHasAd] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [title, setTitle] = useState("");

  return (
    <div>
      <div className="space-y-8 bg-white py-6 mt-6 px-4 sm:px-8 rounded-[32px] shadow-md border border-gray-100">
        {/* Алерт */}
        {alert && (
          <div
            className={`p-4 rounded-2xl border ${
              alert.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {alert.type === "success" ? (
                <Check size={18} />
              ) : (
                <XCircle size={18} />
              )}
              {alert.message}
            </div>
          </div>
        )}

        <h1 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Ваше
          объявление
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Поле: Заголовок */}
          <div className="md:col-span-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              Кого вы ищете?
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-100 border-2 border-transparent focus:border-orange-500/10 focus:bg-white rounded-2xl px-5 py-4 font-bold text-gray-800 outline-none transition-all"
                placeholder="Например: Ищу репетитора по физике для подготовки к вузу"
              />
              <Search
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* Поле: Бюджет */}
          <div>
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
              Ваш бюджет (до)
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
                UZS / 60 МИН
              </span>
            </div>
          </div>
        </div>

        <SubjectPicker />

        {/* О целях */}
        <div>
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
            Цели обучения и пожелания
          </label>
          <div className="bg-gray-100 rounded-[24px] p-5 border-2 border-transparent focus-within:border-orange-500/10 focus-within:bg-white transition-all">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] font-medium text-gray-700 placeholder:text-gray-400 resize-none h-32 leading-relaxed"
              placeholder="Опишите ваш текущий уровень, цель занятий и удобное время..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button
          // onClick={handlePublishAd}
          disabled={isPublishing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-[0.97] flex items-center justify-center gap-2"
        >
          {isPublishing ? (
            <Loader2 className="animate-spin" />
          ) : hasAd ? (
            "Обновить заявку"
          ) : (
            "Разместить заявку"
          )}
        </button>
      </div>
    </div>
  );
};

export default StudentPanel;
