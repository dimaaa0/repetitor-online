import { createClient } from "../../../../utils/supabase/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft, GraduationCap, Clock, Award, Star,
    Heart, Phone, Globe, ShieldCheck
} from "lucide-react";

interface TeacherProfilePageProps {
    params: Promise<{ id: string }>;
}

export default async function TeacherProfilePage({ params }: TeacherProfilePageProps) {
    const supabase = await createClient();
    const { id: shortId } = await params;

    // 1. Получаем данные объявления через RPC
    const { data: adData, error: adError } = await supabase
        .rpc("find_ad_by_short_id", { short_id: shortId })
        .single();

    if (adError || !adData) {
        console.error("Error fetching ad:", adError);
        notFound();
    }

    // 2. Получаем профиль пользователя
    const { data: profileData } = await supabase
        .from("profiles")
        .select("name, surname, avatar_url, is_subscribed")
        .eq("id", adData?.user_id)
        .single();

    const teacher = { ...adData, profiles: profileData };

    return (
        <main className="min-h-screen bg-[#f8fafc] pb-20">
            <div className="max-w-[1250px] mx-auto px-4 sm:px-6 pt-8">
                <Link
                    href="/teachers"
                    className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-6 md:mb-8 group font-medium text-sm sm:text-base"
                >
                    <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Назад к поиску
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                    {/* ЛЕВАЯ КОЛОНКА */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Главная карточка */}
                        <section className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(8,112,184,0.05)]">
                            {/* Верификация */}
                            {teacher.profiles?.is_subscribed && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-bl-3xl flex items-center gap-2 text-xs md:text-sm font-bold shadow-lg z-10">
                                    <ShieldCheck className="w-4 h-4" />
                                    Верифицирован
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
                                {/* Аватар */}
                                <div className="relative group shrink-0">
                                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl rotate-2 group-hover:rotate-0 transition-transform duration-500 overflow-hidden border-4 border-white">
                                        {teacher.profiles?.avatar_url ? (
                                            <img
                                                src={teacher.profiles.avatar_url}
                                                alt="Avatar"
                                                className="w-full h-full object-cover -rotate-2 group-hover:rotate-0 transition-transform duration-500"
                                            />
                                        ) : (
                                            teacher.profiles?.name?.[0] || "?"
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-50">
                                        <div className="bg-amber-400 text-white p-1.5 rounded-lg">
                                            <Star className="w-4 h-4 fill-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grow space-y-4 w-full">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
                                            {teacher.profiles?.name} {teacher.profiles?.surname}
                                        </h1>
                                        <div className="flex flex-wrap justify-center md:flex-row flex-col md:justify-start items-center gap-3">

                                            <span className="text-sm md:text-base text-blue-600 font-bold bg-blue-50 px-4 py-1 rounded-xl">
                                                {teacher?.subject}
                                            </span>

                                            <div className="flex items-center text-amber-500 font-bold text-sm md:text-base">
                                                <Heart className="w-5 h-5 mr-1 text-red-600 fill-red-600" />
                                                <span>{teacher?.likes || 0}</span> лайков
                                            </div>
                                        </div>
                                    </div>

                                    {/* Теги характеристик */}
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">

                                        <div className="flex items-center text-slate-600 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs md:text-sm font-medium">
                                            <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                                            5 лет опыта
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Описание */}
                        <section className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Award className="text-blue-500 w-6 h-6 md:w-7 md:h-7" />
                                О преподавателе
                            </h2>
                            <p className="text-slate-600 hyphens-auto text-justify  text-base md:text-lg leading-relaxed whitespace-pre-line italic">
                                &quot;{teacher?.description || "Преподаватель пока не добавил описание..."}&quot;
                            </p>
                        </section>
                    </div>

                    {/* ПРАВАЯ КОЛОНКА */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200 shadow-xl shadow-blue-900/5  lg:top-8">
                            <div className="mb-8">
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest block mb-2">
                                    Стоимость часа
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl md:text-5xl font-black text-slate-900">
                                        {teacher?.price}
                                    </span>
                                    <span className="text-slate-500 font-bold text-lg">UZS</span>
                                </div>
                            </div>

                            <button className="w-full bg-[#0f172a] hover:bg-slate-800 cursor-pointer text-white font-bold py-4 md:py-5 rounded-2xl md:rounded-3xl transition-all active:scale-95 shadow-lg shadow-slate-200">
                                Оставить отзыв
                            </button>

                            <hr className="my-8 border-slate-100" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-blue-500" />
                                    Контакты
                                </h3>

                                <div className="bg-blue-50/50 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-blue-100/50 relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <p className="text-slate-700 font-semibold leading-relaxed break-words text-sm md:text-base">
                                            {teacher.contacts || "Способы связи не указаны"}
                                        </p>
                                    </div>
                                    <Globe className="absolute -bottom-4 -right-4 w-20 h-20 text-blue-100 opacity-40 group-hover:rotate-12 transition-transform" />
                                </div>

                                <p className="text-[12px] md:text-xs text-slate-400 text-center px-4 leading-tight font-medium">
                                    Пожалуйста, скажите преподавателю, что нашли его на платформе <span className="text-blue-500">Repetitor online</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}