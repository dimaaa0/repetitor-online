"use client";

import { Heart, Filter } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";

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
  },
  {
    id: 2,
    name: "Мария Петрова",
    subject: "Английский язык",
    experience: "Native Speaker, сертификат CELTA",
    students: 5,
    price: "120,000 UZS ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: 3,
    name: "Никита Соколов",
    subject: "Физика",
    experience: "Преподаватель МФТИ, олимпиадная физика",
    students: 3,
    price: "60,000 UZS ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry",
  },
];



const TutorsPageWithAnimation = () => {

  const { user, loading } = useUser();
  
  const realUser = {
    id: user.id,
    name: user.name,
    avatar_url: user.avatar_url,
    
  }

  const [showNotify, setShowNotify] = useState(false);

  const userRole = "Tutor";

  useEffect(() => {
    if (userRole === "Tutor") {
      const timer = setTimeout(() => setShowNotify(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [userRole]);

  return (
    <div className="min-h-screen   bg-[#FBFDFF] pb-20">
      {/* Декоративный фон шапки */}
      <div className="bg-white border-b  border-slate-100  py-12 mb-8">
        <div className="max-w-[1250] mx-auto px-2 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl  md:text-4xl font-black text-slate-900 tracking-tight">
                Поиск <span className="text-blue-600">учителя</span>
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                найдите своего идеального репетитора по предмету, уровню и цене
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

      {/* Grid */}
      <div className="max-w-[1250] mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Актуальные заявки: {tutors.length}
          </span>
        </div>
        <div className="grid grid-cols-1 max-w-[1250]  md:grid-cols-1 lg:grid-cols-2  gap-8">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="group  bg-white rounded-3xl border border-gray-100 p-2 pb-4 sm:p-6 md:p-8 transition-all duration-500 
                 hover:shadow-[0_20px_50px_rgba(8,112,184,0.12)] hover:-translate-y-2 relative 
                 overflow-hidden flex flex-col h-full"
            >
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
