"use client";

import React, { useEffect, useState } from "react";
import { Wallet, BookOpen, MessageCircle, Filter } from "lucide-react";
import { createClient } from "../../../../src/utils/supabase/client";
import { title } from "process";

const Announcements = () => {
  const [dataLoading, setDataLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const supabase = createClient();

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
          likes: 67,
        }));
        setStudents(formattedData);
        console.log(formattedData);
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
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} className="text-blue-600" />
                Фильтры
              </button>
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

        {/* Список объявлений */}
        <div className="grid gap-6 pb-10">
          {students.map((student) => (
            <div
              key={student.id}
              className="relative bg-white rounded-3xl border border-slate-100 p-2 pb-4 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:-translate-y-1 group"
            >
              {/* Бейдж цели обучения */}
              <div className="absolute top-6 right-6 hidden sm:block">
                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {student.subject}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {student.name[0]}
                    </div>
                    <span className="text-sm font-bold text-slate-500">
                      {student.name} {student.surname}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {student.postedAt}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {student.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-6 max-w-3xl">
                    {student.description}
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
                        <p className="text-sm font-black text-slate-900">
                          {student.price}
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

export default Announcements;
