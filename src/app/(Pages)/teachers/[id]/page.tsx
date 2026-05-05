import { createClient } from "../../../../utils/supabase/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, GraduationCap, Clock, Award, Star } from "lucide-react";

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id: shortId } = await params;

  // 1. Получаем данные учителя.
  // Важно: .like() работает только с текстовыми полями.
  // Если id в БД имеет тип uuid, Supabase может потребовать явного приведения типов,
  // но обычно поиск по части строки через .like работает.
  const { data: adData, error } = await supabase
    .rpc("find_ad_by_short_id", { short_id: shortId })
    .single();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name, surname, avatar_url, is_subscribed")
    .eq("id", adData.user_id)
    .single();

  const teacher = { ...adData, profiles: profileData };

  console.log(teacher);

  // Если произошла ошибка или данных нет
  if (error || !adData) {
    console.error("Error fetching teacher:", error);
    notFound();
  }

  // 2. Если не нашли — показываем стандартную 404
  if (!teacher) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Шапка с кнопкой назад */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <Link
          href="/teachers"
          className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Назад к списку
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ЛЕВАЯ КОЛОНКА: Основная инфа */}
          <div className="lg:col-span-2 space-y-6">
            {/* Карточка профиля */}
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Аватар */}
                <div className="w-32 h-32 bg-blue-600 rounded-4xl shrink-0 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-blue-200">
                  {teacher?.profiles?.avatar_url ? (
                    <img
                      src={teacher.profiles.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-4xl"
                    />
                  ) : (
                    `${teacher?.profiles?.name?.[0] || "?"}`
                  )}
                </div>

                <div className="grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-extrabold text-slate-900">
                      {teacher?.profiles?.name} {teacher?.profiles?.surname}
                    </h1>
                    <div className="bg-blue-50 text-blue-600 p-1.5 rounded-full">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-xl text-blue-600 font-semibold mb-4">
                    {teacher?.subject}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-full text-sm">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Высшее образование
                    </div>
                    <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-full text-sm">
                      <Clock className="w-4 h-4 mr-2" />5 лет опыта
                    </div>
                    <div className="flex items-center text-amber-500 bg-amber-50 px-4 py-2 rounded-full text-sm font-bold">
                      <Star className="w-4 h-4 mr-2 fill-amber-500" />
                      4.9 (48 отзывов)
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Секция "О себе" */}
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                О преподавателе
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                {teacher?.description || "Информация временно отсутствует..."}
              </p>
            </section>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Виджет записи */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
              <div>
                <span className="text-slate-400 text-sm block mb-1">
                  Стоимость занятия
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {teacher?.price}
                  </span>
                  <span className="text-slate-500 font-medium">UZS / час</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
