"use client";

import React, { useEffect, useState } from "react";
import { Wallet, BookOpen, MessageCircle, Filter } from "lucide-react";
import { createClient } from "../../../../src/utils/supabase/client";
import StudentCard from "@/src/components/UI/StudentCard";
import FilterPanel from "../../../components/UI/StudentFilter";
import { useStudentAnnouncement } from "../../../context/StudentAnnouncementContext";
import { useUser } from "@/src/context/UserContext";

const Announcements = () => {
  const [dataLoading, setDataLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const { user, loading } = useUser();
  const { announcements, announcementsLoading } = useStudentAnnouncement();
  const supabase = createClient();

  const [filters, setFilters] = useState({
    subject: "",
    maxPrice: 500000,
    sortByLikes: false,
    sortAscPrice: false,
    sortDescPrice: false,
  });

  const [openFilter, setOpenFilter] = useState(false);

  const toggleFilter = () => setOpenFilter(!openFilter);

  useEffect(() => {
    const fetchTeachers = async () => {
      setDataLoading(true);
      const { data, error } = await supabase.from("student_ads").select(`
            id,
            title,
            subject,
            description,
            price,
            profiles (
              name,
              surname,
              avatar_url
            )
          `);

      if (error) {
        console.error("Ошибка загрузки:", error);
      } else {
        const formattedData = data.map((ad: any) => ({
          id: ad.id,
          title: ad.title,
          name: ad.profiles?.name,
          surname: ad.profiles?.surname,
          avatar: ad.profiles?.avatar_url,
          subject: ad.subject,
          description: ad.description,
          price: ad.price + " UZS",
          likes: 0,
        }));
        setStudents(formattedData);
      }
      setDataLoading(false);
    };

    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen   bg-[#FBFDFF] pb-20">
      {/* Декоративный фон шапки */}
      <div className="bg-white border-b  border-slate-100  py-12 mb-8">
        <div className="max-w-[1250] mx-auto px-2 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl  md:text-4xl font-black text-slate-900 tracking-tight">
                Лента <span className="text-blue-600">объявлений</span>
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Свежие запросы от учеников, которым нужна ваша помощь
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
            Актуальные заявки: {students.length}
          </span>
        </div>

        <div className="grid grid-cols-1 pb-4 gap-8">
          {announcementsLoading && announcements.length === 0
            ? Array.from({ length: 4 }).map((_, key) => (
                <StudentCard key={`skeleton-${key}`} student={{}} isLoading />
              ))
            : announcements.map((student: any, key: number) => (
                <StudentCard
                  key={student.id || key}
                  student={student}
                  isLoading={!student.name || !student.subject}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
