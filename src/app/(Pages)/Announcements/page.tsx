"use client";

import React from "react";
import {
  Search,
  Clock,
  Wallet,
  BookOpen,
  ChevronRight,
  MessageCircle,
  Filter,
} from "lucide-react";

const ads = [
  {
    id: 1,
    studentName: "Артем, 11 класс",
    title: "Ищу репетитора по профильной математике",
    description:
      "Нужна помощь в подготовке к ЕГЭ. Западают задачи с параметрами и геометрия. Хотелось бы заниматься 2 раза в неделю вечером.",
    budget: "до 150,000 UZS",
    subject: "Математика",
    postedAt: "2 часа назад",
    goal: "ЕГЭ / ОГЭ",
  },
  {
    id: 2,
    studentName: "Елена",
    title: "Разговорный английский для переезда",
    description:
      "Уровень сейчас Intermediate. Нужно подтянуть говорение и убрать страх общения. Рассматриваю занятия только с носителем или профи.",
    budget: "100,000 - 120,000 UZS",
    subject: "Английский",
    postedAt: "Сегодня",
    goal: "Релокация",
  },
];

const AnnouncementsPage = () => {
  return (
    <div className="min-h-screen   bg-[#FBFDFF] pb-20">
      {/* Декоративный фон шапки */}
      <div className="bg-white border-b  border-slate-100 py-12 mb-8">
        <div className="max-w-[1250] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl  md:text-4xl font-black text-slate-900 tracking-tight">
                Лента <span className="text-blue-600">объявлений</span>
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Свежие запросы от учеников, которым нужна ваша помощь
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} className="text-blue-600" />
                Фильтры
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1250] mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Актуальные заявки: {ads.length}
          </span>
        </div>

        {/* Список объявлений */}
        <div className="grid gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="relative bg-white rounded-3xl border border-slate-100 p-6 md:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:-translate-y-1 group"
            >
              {/* Бейдж цели обучения */}
              <div className="absolute top-6 right-6 hidden sm:block">
                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {ad.goal}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {ad.studentName[0]}
                    </div>
                    <span className="text-sm font-bold text-slate-500">
                      {ad.studentName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {ad.postedAt}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {ad.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6 max-w-3xl">
                    {ad.description}
                  </p>

                  <div className="flex flex-wrap gap-6 items-center pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">
                          Предмет
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {ad.subject}
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
                        <p className="text-sm font-black text-slate-900">
                          {ad.budget}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end md:justify-center items-center gap-3">
                  <button className="flex-1 md:flex-none w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                    <MessageCircle size={18} />
                    Откликнуться
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
