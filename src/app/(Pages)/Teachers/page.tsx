"use client";

import { Heart, Filter } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import { useTeacherAnnouncement } from "../../../context/TeacherAnnouncementContext";
import TeacherCard from "../../../components/UI/TeacherCard";
import FilterPanel from "@/src/components/UI/TeacherFilter";

const TutorsPageWithAnimation = () => {
  const { user, loading } = useUser();
  const { announcements, announcementsLoading } = useTeacherAnnouncement();

  const [filters, setFilters] = useState({
    subject: "",
    maxPrice: 500000,
    sortByLikes: false,
    sortAscPrice: false,
    sortDescPrice: false,
  });

  // useEffect(()=> {
  // const currentSubscriptionStatus = asyns () => {
  //   if (!user) return;

  // }}

  const [openFilter, setOpenFilter] = useState(false);

  const toggleFilter = () => setOpenFilter(!openFilter);

  const [showNotify, setShowNotify] = useState(false);

  // useEffect(() => {
  //   if (userRole === "Tutor") {
  //     const timer = setTimeout(() => setShowNotify(true), 1500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [userRole]);

  return (
    <div className="min-h-screen   bg-[#FBFDFF] pb-20">
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
            <div className="flex gap-3 relative">
              <button
                className="flex relative cursor-pointer items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                onClick={toggleFilter}
              >
                <Filter size={18} className="text-blue-600" />
                Фильтры
              </button>
              {openFilter && (
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  onClose={() => setOpenFilter(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1250] mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
            Актуальные заявки: {announcements.length}
          </span>
        </div>

        <div className="grid grid-cols-1 pb-4 gap-8 md:grid-cols-1 lg:grid-cols-2 ">
          {announcementsLoading && announcements.length === 0
            ? Array.from({ length: 4 }).map((_, key) => (
                <TeacherCard key={`skeleton-${key}`} teacher={{}} isLoading />
              ))
            : announcements.map((teacher, key) => (
                <TeacherCard
                  key={teacher.id || key}
                  teacher={teacher}
                  isLoading={!teacher.name || !teacher.subject}
                />
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
