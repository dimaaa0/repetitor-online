import { createClient } from "../../../../utils/supabase/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  GraduationCap,
  Clock,
  Award,
  Star,
  Heart,
  Phone,
  Globe,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import CommentForm from "./_components/CommentForm";

interface TeacherProfilePageProps {
  params: Promise<{ id: string }>;
}

interface adType {
  id: number;
  user_id: string;
  subject: string;
  description: string;
  price: string;
  likes: number;
  contacts: string;
}

export default async function TeacherProfilePage({
  params,
}: TeacherProfilePageProps) {
  const supabase = await createClient();
  const { id: shortId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Данные объявления
  const { data: adData, error: adError }: { data: adType | null; error: any } =
    await supabase.rpc("find_ad_by_short_id", { short_id: shortId }).single();

  if (adError || !adData) notFound();

  // 2. Профиль
  const { data: profileData }: { data: any } = await supabase
    .from("profiles")
    .select("name, surname, avatar_url, is_subscribed")
    .eq("id", adData.user_id)
    .single();

  let hasCommented = false;
  if (user) {
    const { data: existingComment } = await supabase
      .from("comments")
      .select("id")
      .eq("ad_id", adData.id)
      .eq("user_id", user.id)
      .maybeSingle(); // maybeSingle не выдает ошибку, если запись не найдена

    hasCommented = !!existingComment;
  }

  const teacher = { ...adData, profiles: profileData };
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-[1250px] relative mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="lg:col-span-8 space-y-6">
            {/* Главная карточка */}
            <section className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(8,112,184,0.05)]">
              <div className="flex flex-col md:flex-row pt-4 gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
                {/* Аватар */}
                <div className="relative group shrink-0">
                  {teacher.profiles?.avatar_url ? (
                    <div
                      className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] md:rounded-[3rem] 
               flex items-center justify-center overflow-hidden 
               border-2 border-gray-200 p-1 bg-white"
                    >
                      <img
                        src={teacher.profiles.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-[1.8rem] md:rounded-[2.8rem]"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl group-hover:rotate-0 transition-transform duration-500 overflow-hidden ">
                      {teacher.profiles?.name?.[0] || "?"}
                    </div>
                  )}
                </div>

                <div className="grow space-y-4 w-full">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
                      {teacher.profiles?.name} {teacher.profiles?.surname}
                    </h1>
                    <div className="flex flex-wrap flex-column  flex-column flex-col justify-center md:justify-start items-center md:items-start gap-3">
                      <span className="text-sm md:text-base text-blue-600 font-bold bg-blue-50 px-4 py-1 rounded-xl">
                        {teacher?.subject}
                      </span>

                      <div className="flex flex-wrap gap-3 sm:justify-start justify-center">
                        <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-full text-sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          30 отзывов
                        </div>
                        <div className="flex items-center text-red-500 bg-red-50 px-4 py-2 rounded-full text-sm font-bold">
                          <Heart className="w-4 h-4 mr-2 fill-red-500" />
                          {teacher?.likes || "0"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Award className="text-blue-500 w-6 h-6 md:w-7 md:h-7" />О
                преподавателе
              </h2>
              <p className="text-slate-600 hyphens-auto text-justify  text-base md:text-lg leading-relaxed whitespace-pre-line italic">
                &quot;
                {teacher?.description ||
                  "Преподаватель пока не добавил описание..."}
                &quot;
              </p>
            </section>
          </div>

          <div className="lg:col-span-4">
            {" "}
            {/* Убрал space-y-6 отсюда, чтобы не мешал прилипанию */}
            <div className="sticky top-26 space-y-6 bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200 shadow-xl">
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
                  Пожалуйста, скажите преподавателю, что нашли его на платформе{" "}
                  <span className="text-blue-500">Repetitor online</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* СЕКЦИЯ ОТЗЫВОВ */}
        <section className="bg-white lg:col-span-8 mt-6 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
              <MessageSquare className="text-blue-500 w-6 h-6 md:w-7 md:h-7" />
              Отзывы учеников
            </h2>
          </div>

          {/* ФОРМА ДОБАВЛЕНИЯ КОММЕНТАРИЯ */}
          {hasCommented ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
              Вы уже оставили отзыв к этому объявлению
            </div>
          ) : (
            <CommentForm adId={adData.id} userId={user?.id} />
          )}
          <hr className="border-slate-100" />

          <div className="space-y-6">
            <div className="group sm:p-6 p-0 rounded-3xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 hyphens-auto text-justify">
                      Писаренко Дмитрий
                    </h4>
                    <p className="text-xs text-slate-400">12 мая 2024</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 hyphens-auto text-justify ">
                Чтобы органично вписать форму добавления комментария, лучше
                всего сделать её аккуратным текстовым полем в начале секции,
                которое «разворачивается» при клике, или отдельным блоком перед
                списком отзывов. Чтобы органично вписать форму добавления
                комментария, лучше всего сделать её аккуратным текстовым полем в
                начале секции, которое «разворачивается» при клике, или
                отдельным блоком перед списком отзывов. Чтобы органично вписать
                форму добавления комментария, лучше всего сделать её аккуратным
                текстовым полем в начале секции, которое «разворачивается» при
                клике, или отдельным блоком перед списком отзывов.
              </p>
            </div>
          </div>

          {/* Кнопка "Показать еще" */}
          <button className="w-full py-4 cursor-pointer text-slate-500 font-semibold hover:text-blue-600 transition-colors border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-200">
            Показать все отзывы (30)
          </button>
        </section>
      </div>
    </main>
  );
}
