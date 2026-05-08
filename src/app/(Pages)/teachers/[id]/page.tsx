import { createClient } from "../../../../utils/supabase/client";
import { notFound } from "next/navigation";
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
import CommentsList from "./_components/CommentsList"; // Импортируем новый клиентский компонент

interface TeacherProfilePageProps {
  params: Promise<{ id: string }>;
}

export interface adType {
  id: number;
  user_id: string;
  subject: string;
  description: string;
  price: string;
  likes: number;
  contacts: string;
}

export interface commentType {
  id: number;
  content: string;
  created_at: string;
  profiles: {
    name: string;
    surname: string;
    avatar_url: string;
  };
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

  // 2. Профиль учителя
  const { data: profileData }: { data: any } = await supabase
    .from("profiles")
    .select("name, surname, avatar_url, is_subscribed")
    .eq("id", adData.user_id)
    .single();

  // 3. Проверка, оставлял ли пользователь отзыв
  let hasCommented = false;
  if (user) {
    const { data: existingComment } = await supabase
      .from("comments")
      .select("id")
      .eq("ad_id", adData.id)
      .eq("user_id", user.id)
      .maybeSingle();

    hasCommented = !!existingComment;
  }

  // 4. Загрузка всех комментариев
  const { data: commentsData } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      profiles (
        avatar_url,
        name,
        surname
      )
    `)
    .eq("ad_id", adData.id)
    .order("created_at", { ascending: false });

  const teacher = { ...adData, profiles: profileData };
  const comments: commentType[] = (commentsData as any) || [];

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-[1250px] relative mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(8,112,184,0.05)]">
              <div className="flex flex-col md:flex-row pt-4 gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative group shrink-0">
                  {teacher.profiles?.avatar_url ? (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center overflow-hidden border-2 border-gray-200 p-1 bg-white">
                      <img
                        src={teacher.profiles.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-[1.8rem] md:rounded-[2.8rem]"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl overflow-hidden ">
                      {teacher.profiles?.name?.[0] || "?"}
                    </div>
                  )}
                </div>

                <div className="grow space-y-4 w-full">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
                      {teacher.profiles?.name} {teacher.profiles?.surname}
                    </h1>
                    <div className="flex flex-wrap flex-col justify-center md:justify-start items-center md:items-start gap-3">
                      <span className="text-sm md:text-base text-blue-600 font-bold bg-blue-50 px-4 py-1 rounded-xl">
                        {teacher?.subject}
                      </span>
                      <div className="flex flex-wrap gap-3 sm:justify-start justify-center">
                        <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-full text-sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {comments.length} отзывов
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
                <Award className="text-blue-500 w-6 h-6 md:w-7 md:h-7" />О преподавателе
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-line italic">
                &quot;{teacher?.description || "Преподаватель пока не добавил описание..."}&quot;
              </p>
            </section>
          </div>

          {/* ПРАВАЯ КОЛОНКА (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6 bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200 shadow-xl">
              <div className="mb-8">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest block mb-2">Стоимость часа</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-slate-900">{teacher?.price}</span>
                  <span className="text-slate-500 font-bold text-lg">UZS</span>
                </div>
              </div>

              {/* Ссылка-якорь для скролла к форме */}
              <a 
                href="#reviews"
                className="w-full bg-[#0f172a] hover:bg-slate-800 flex items-center justify-center cursor-pointer text-white font-bold py-4 md:py-5 rounded-2xl md:rounded-3xl transition-all active:scale-95 shadow-lg"
              >
                Оставить отзыв
              </a>

              <hr className="my-8 border-slate-100" />

              <div className="space-y-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-500" /> Контакты
                </h3>
                <div className="bg-blue-50/50 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-blue-100/50 relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-slate-700 font-semibold leading-relaxed break-words text-sm md:text-base">
                      {teacher.contacts || "Способы связи не указаны"}
                    </p>
                  </div>
                  <Globe className="absolute -bottom-4 -right-4 w-20 h-20 text-blue-100 opacity-40 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* СЕКЦИЯ ОТЗЫВОВ */}
        <section id="reviews" className="bg-white lg:col-span-8 mt-6 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
              <MessageSquare className="text-blue-500 w-6 h-6 md:w-7 md:h-7" /> Отзывы учеников
            </h2>
          </div>

          {/* ФОРМА */}
          {hasCommented ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
              Вы уже оставили отзыв к этому объявлению
            </div>
          ) : (
            <CommentForm adId={adData.id} userId={user?.id} />
          )}

          <hr className="border-slate-100" />

          {/* КЛИЕНТСКИЙ СПИСОК С ПАГИНАЦИЕЙ */}
          <CommentsList comments={comments} />
          
        </section>
      </div>
    </main>
  );
}