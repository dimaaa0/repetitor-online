"use client";

import { Heart, Filter, X, Clock } from "lucide-react"; 
import React, { useState, useEffect } from "react";
import { useTeacherAnnouncement } from "../../../../context/TeacherAnnouncementContext";
import TeacherCard from "../../../../components/UI/TeacherCard";
import FilterPanel from "@/src/components/UI/TeacherFilter";
import { useTranslations } from "next-intl";


const TutorsPageWithAnimation = () => {
  const { announcements, announcementsLoading } = useTeacherAnnouncement();
  
  const tSearch = useTranslations("TeacherAnnouncements.Search");
  const [filters, setFilters] = useState({
    subject: "",
    maxPrice: 500000,
    sortByLikes: false,
    sortAscPrice: false,
    sortDescPrice: false,
  });

  const [openFilter, setOpenFilter] = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  const toggleFilter = () => setOpenFilter(!openFilter);
  
  return (
    <div className="min-h-screen bg-[#FBFDFF] pb-20 relative ">
      <div className="bg-white border-b border-slate-100 py-6 sm:py-12 mb-8">
        <div className="max-w-[1250px] mx-auto px-2 sm:px-6">
          {" "}
          {/* Исправил max-w-[1250] на [1250px] */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {tSearch("title")} <span className="text-blue-600">{tSearch("titleAccent")}</span>
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                {tSearch("subtitle")}
              </p>
            </div>
            <div className="flex gap-3 relative">
              <button
                className="flex relative cursor-pointer items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                onClick={toggleFilter}
              >
                <Filter size={18} className="text-blue-600" />
                {tSearch("filters")}
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

      <div className="max-w-[1250px] mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
            {tSearch("activeApplications")} {announcements?.length || 0}
          </span>
        </div>

        <div className="grid grid-cols-1 pb-4 gap-8 md:grid-cols-1 lg:grid-cols-2">
          {announcementsLoading &&
          (!announcements || announcements.length === 0)
            ? Array.from({ length: 4 }).map((_, index) => (
                <TeacherCard
                  key={`skeleton-${index}`}
                  teacher={{} as any}
                  isLoading={true}
                />
              ))
            : announcements?.map((teacher: any) => (
                <TeacherCard
                  key={teacher.id || Math.random()}
                  teacher={teacher}
                  isLoading={false}
                />
              ))}
        </div>
      </div>

    </div>
  );
};

export default TutorsPageWithAnimation;
