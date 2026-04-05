"use client";

import { Heart, SlidersHorizontal, Bell, Clock, X } from "lucide-react";
import React, { useState, useEffect } from "react";

const tutors = [
  {
    id: 1,
    name: "Александр Иванов",
    subject: "Математика (ЕГЭ/ОГЭ)",
    experience:
      "10 лет стажа, подготовил 100+ стобалльников аидыовраол арвыоарывл ывоаровыра оырваорвы ыоварлваыр оывра олвыорывал ыволароывр ыовра лдопвалд лваодлпоав двлаопдва",
    students: 8,
    price: "100,000 UZS ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    tags: ["Профи", "Терпеливый"],
  },
  {
    id: 2,
    name: "Мария Петрова",
    subject: "Английский язык",
    experience: "Native Speaker, сертификат CELTA",
    students: 5,
    price: "120,000 UZS ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    tags: ["Native Speaker", "Дети"],
  },
  {
    id: 3,
    name: "Никита Соколов",
    subject: "Физика",
    experience: "Преподаватель МФТИ, олимпиадная физика",
    students: 3,
    price: "60,000 UZS ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry",
    tags: ["Олимпиады", "Вуз"],
  },
];

const TutorsPageWithAnimation = () => {
  const [showNotify, setShowNotify] = useState(false);

  const userRole = "Tutor";

  useEffect(() => {
    if (userRole === "Tutor") {
      const timer = setTimeout(() => setShowNotify(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [userRole]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 pb-24">
      <div className="max-w-[1250] px-6 mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10 pt-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Наши <span className="text-blue-600">репетиторы</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Найдено специалистов:{" "}
              <span className="text-slate-900">{tutors.length}</span>
            </p>
          </div>
          <button className="group bg-white flex items-center gap-2 cursor-pointer border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
            Фильтры
            <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="group bg-white rounded-3xl border border-slate-100 p-6 transition-all duration-500 
                 hover:shadow-[0_20px_50px_rgba(8,112,184,0.12)] hover:-translate-y-2 relative 
                 overflow-hidden flex flex-col h-full" // <-- ДОБАВИЛИ flex-col и h-full
            >
              {/* 1. Верхняя часть (Аватар, Имя, Теги) */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={tutor.avatar}
                  className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100"
                  alt=""
                />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">
                    {tutor.name}
                  </h3>
                  <p className="text-blue-600 text-sm font-semibold mt-1 inline-block bg-blue-50 px-2 py-0.5 rounded-md">
                    {tutor.subject}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-bold text-slate-600">
                    {tutor.students}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {tutor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase font-extrabold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 2. ОПИСАНИЕ - САМЫЙ ВАЖНЫЙ БЛОК */}
              <div className="p-4 bg-slate-50 rounded-2xl mb-6 flex-grow">
                {" "}
                {/* <-- flex-grow заставляет этот блок растягиваться */}
                <div className="p-2 bg-slate-50 rounded-2xl mb-2 flex-grow overflow-hidden">
                  <p
                    className="text-sm text-slate-600 leading-relaxed italic 
                hyphens-auto break-words line-clamp-3 md:line-clamp-4"
                    style={{ hyphens: "auto", WebkitHyphens: "auto" }}
                  >
                    "{tutor.experience}"
                  </p>
                </div>
              </div>

              {/* 3. ПОДВАЛ - ВСЕГДА ПРИЖАТ К НИЗУ */}
              <div className="mt-auto pt-5 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <span className="text-2xl font-black text-slate-900">
                    {tutor.price}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorsPageWithAnimation;

//! СДЕЛАТЬ ЕСЛИ АККАУНТА РОЛЬ РЕПЕТИТОР, ТО КАЖДЫЙ РАЗ ВЫДАВАТЬ В ПРАВОМ НИЖНЕМ УГЛУ УВЕДОМЛЕНИЕ, ЧТОБЫ ЧЕЛОВЕК НЕ ЗАБЫЛ ИЗМЕНИТЬ СВОЕ РАСПИСАНИЕ, ДЛЯ КОРРЕКТНОЙ СОРТИРОВКИ.

{
  /* {showNotify && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white border-l-4 border-blue-600 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-5 max-w-[320px] relative group">
            <button
              onClick={() => setShowNotify(false)}
              className="absolute top-2 right-2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="text-blue-600 animate-pulse" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Обновите расписание!
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Чтобы быть выше в поиске, держите календарь актуальным.
                </p>
                <button className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4">
                  Перейти в календарь →
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */
}
