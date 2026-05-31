import react from "react";
import { createClient } from "../../../../../utils/supabase/client";
import {
  BookOpen,
  Globe,
  Heart,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import { notFound } from "next/navigation";
import FreeTimeBar from "../../../../../components/UI/FreeTimeBar";

interface StudentProfilePageProps {
  params: Promise<{ id: string }>;
}

interface adType {
  id: number;
  user_id: string;
  subject: string;
  description: string;
  title: string;
  price: string;
  contacts: string;
}

export default async function StudentProfilePage({
  params,
}: StudentProfilePageProps) {
  const supabase = await createClient();
  const { id: shortId } = await params;

  const { data: adData, error: adError }: { data: adType | null; error: any } =
    await supabase
      .rpc("find_student_ad_by_short_id", { short_id: shortId })
      .single();

  if (adError || !adData) {
    notFound();
  }

  const { data: profileData }: { data: any } = await supabase
    .from("profiles")
    .select("name, surname, avatar_url, is_subscribed")
    .eq("id", adData.user_id)
    .single();

  const student = { ...adData, profiles: profileData };

  const { data: availability } = await supabase
    .from("profiles")
    .select("availability")
    .eq("id", adData.user_id)
    .single();

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ЛЕВАЯ КОЛОНКА (Основная информация) */}
        <div className="lg:col-span-2 space-y-6">
          {/* КАРТОЧКА 1: Шапка профиля с данными пользователя */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Аватар пользователя */}
            <div className="relative shrink-0">
              {student.profiles?.avatar_url ? (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center overflow-hidden border-2 border-gray-200 p-1 bg-white">
                  <img
                    src={student.profiles.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-[1.8rem] md:rounded-[2.8rem]"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl overflow-hidden ">
                  {student.profiles?.name?.[0] || "?"}
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                {/* Имя и фамилия пользователя */}
                <p className="text-blue-600 text-32 font-black uppercase tracking-widest">
                  {student.profiles?.name} {student.profiles?.surname}
                </p>
              </div>

              <p className="text-slate-600 text-lg hyphens-auto lang-ru break-words text-justify leading-relaxed max-w-2xl mx-auto md:mx-0">
                {student.title}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                  <BookOpen size={16} className="mr-2" />
                  {student.subject}
                </div>
              </div>
            </div>
          </div>

          {/* КАРТОЧКА 2: Описание заявки */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Детали поиска
              </h3>
            </div>
            <p className="text-slate-600 hyphens-auto lang-ru break-words text-justify leading-[1.8] text-lg">
              "{student.description}"
            </p>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Цена и контакты) */}
        <div className="space-y-4">
          <div className=" sticky top-24 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Бюджет в час
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800">
                  {student.price}
                </span>
                <span className="text-slate-400 font-bold">UZS</span>
              </div>
            </div>
            <div className="space-y-6 ">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-500" /> Контакты
              </h3>
              <div className="bg-blue-50/50 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-blue-100/50 relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-slate-700 font-semibold leading-relaxed break-words text-sm md:text-base">
                    {student.contacts || "Способы связи не указаны"}
                  </p>
                </div>
                <Globe className="absolute -bottom-4 -right-4 w-20 h-20 text-blue-100 opacity-40 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <hr className="my-6 border-slate-100" />

            <div className="space-y-4">
              {availability && <FreeTimeBar initialSchedule={availability} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
