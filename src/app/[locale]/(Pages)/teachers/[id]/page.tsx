import { createClient } from "../../../../../utils/supabase/client"; // Убедись, что для сервера у тебя используется серверный клиент, если это необходимо
import { notFound } from "next/navigation";
import { Award, Globe, Heart, MessageSquare, Phone } from "lucide-react";
import CommentForm from "./_components/CommentForm";
import CommentsList from "./_components/CommentsList";
import FreeTimeBar from "@/src/components/UI/FreeTimeBar";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

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
  user_id: string;
  id: number;
  content: string;
  created_at: string;
  profiles: {
    name: string;
    surname: string;
    avatar_url: string;
    is_banned: boolean;
  };
}

// 1. ДИНАМИЧЕСКОЕ SEO: Генерируется на сервере до рендеринга страницы
export async function generateMetadata({
  params,
}: TeacherProfilePageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { id: shortId } = await params;

  const { data: adData }: { data: adType | null } = await supabase
    .rpc("find_ad_by_short_id", { short_id: shortId })
    .single();

  const t = await getTranslations("TeacherProfile");
  const tSubjects = await getTranslations("subjects_list");

  if (!adData) return { title: t("teacherNotFoundTitle") };

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name, surname")
    .eq("id", adData.user_id)
    .single();

  const fullName = profileData
    ? `${profileData.name} ${profileData.surname}`
    : t("default_teacher");

  // Разбиваем строку предметов на массив ключей
  const subjectKeys = (adData.subject || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  let translatedSubject = "";

  // Вспомогательная функция для очеловечивания списков (например: "А, Б и В")
  const formatList = (array: string[], conjunction: string) => {
    if (array.length <= 1) return array[0] || "";
    if (array.length === 2) return array.join(conjunction);
    return (
      array.slice(0, -1).join(", ") + conjunction + array[array.length - 1]
    );
  };

  if (subjectKeys.length > 0) {
    let firstRaw: any = null;
    try {
      firstRaw = tSubjects.raw(subjectKeys[0]);
    } catch {
      firstRaw = tSubjects.has(subjectKeys[0])
        ? tSubjects(subjectKeys[0])
        : subjectKeys[0];
    }

    // --- 1. ЛОГИКА ДЛЯ УЗБЕКСКОГО ЯЗЫКА ---
    if (firstRaw && typeof firstRaw === "object" && "name" in firstRaw) {
      const items = subjectKeys.map((key) => {
        try {
          return tSubjects.raw(key);
        } catch {
          return { name: key, type: "academic" };
        }
      });

      const names = items.map((item) => item.name);
      const hasAcademic = items.some((item) => item.type === "academic");

      const suffix = hasAcademic
        ? items.length > 1
          ? "fanlaridan"
          : "fanidan"
        : "bo‘yicha";

      // Склеит в: "matematika, fizika va kimyo fanlaridan"
      translatedSubject = `${formatList(names, " va ")} ${suffix}`;
    }
    // --- 2. ЛОГИКА ДЛЯ РУССКОГО И АНГЛИЙСКОГО ЯЗЫКОВ ---
    else {
      const translatedItems = subjectKeys.map((key) => {
        const dativeKey = `${key}_dative`;
        if (tSubjects.has(dativeKey)) return tSubjects(dativeKey);
        if (tSubjects.has(key)) return tSubjects(key);
        return key;
      });

      const isRussian = translatedItems.some((item) => /[а-яёА-ЯЁ]/.test(item));
      const conjunction = isRussian ? " и " : " and ";

      translatedSubject = formatList(translatedItems, conjunction);
    }
  }

  const metaParams = {
    name: fullName,
    subjectTranslated: translatedSubject,
  };

  return {
    title: t("metaTitle", metaParams),
    description:
      adData.description?.slice(0, 160) || t("metaDescription", metaParams),
    openGraph: {
      title: t("metaTitle", metaParams),
      description:
        adData.description?.slice(0, 160) || t("metaDescription", metaParams),
      type: "profile",
    },
  };
}

export default async function TeacherProfilePage({
  params,
}: TeacherProfilePageProps) {
  const supabase = await createClient();
  const { id: shortId } = await params;

  const t = await getTranslations("TeacherProfile");
  const tSubjects = await getTranslations("subjects_list");

  const getTranslation = (
    subjectsData: string | string[] | undefined | null,
  ): string[] => {
    if (!subjectsData) return [];

    // 1. Приводим любые входные данные к единому массиву строк
    const keysArray = Array.isArray(subjectsData)
      ? subjectsData
      : subjectsData.split(",").map((s) => s.trim());

    // 2. Переводим каждый элемент массива
    return keysArray.map((rawKey) => {
      // Чистим от префикса "subjects_list.", если он прилетел из базы (как на скрине)
      const key = rawKey.replace("subjects_list.", "");

      if (!tSubjects.has(key)) return key;

      try {
        const rawValue = tSubjects.raw(key);

        // Если это узбекский объект — забираем только name
        if (rawValue && typeof rawValue === "object" && "name" in rawValue) {
          return rawValue.name;
        }

        // Для RU/EN возвращаем обычную строку
        return tSubjects(key);
      } catch (e) {
        return key; // фолбек
      }
    });
  };

  // Шаг 1: Получаем данные объявления (быстрый выход, если объявления нет)
  const { data: adData, error: adError }: { data: adType | null; error: any } =
    await supabase.rpc("find_ad_by_short_id", { short_id: shortId }).single();

  if (adError || !adData) {
    notFound();
  }

  // Шаг 2: Оптимизация! Объединяем запросы к профилю и загружаем комментарии ПАРАЛЛЕЛЬНО
  const [profileResult, commentsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("name, surname, avatar_url, is_subscribed, availability") // Сразу забрали и availability!
      .eq("id", adData.user_id)
      .single(),
    supabase
      .from("comments")
      .select(
        `
        user_id,
        id,
        content,
        created_at,
        profiles (
          avatar_url,
          name,
          surname,
          is_banned
        )
      `,
      )
      .eq("ad_id", adData.id)
      .order("created_at", { ascending: false }),
  ]);

  const profileData = profileResult.data;
  const commentsData = commentsResult.data;

  // Фильтруем забаненных пользователей
  const comments: commentType[] = ((commentsData as any[]) || []).reduce(
    (acc: commentType[], comment: any) => {
      if (comment.profiles?.is_banned !== true) {
        acc.push(comment);
      }
      return acc;
    },
    [],
  );

  const teacher = { ...adData, profiles: profileData };

  // Перевод предмета, если ключ есть в локализации
  const translatedSubject = tSubjects.has(teacher.subject)
    ? tSubjects(teacher.subject)
    : teacher.subject;

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
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] md:rounded-[3rem] border-2 border-gray-200 p-1 bg-white relative overflow-hidden">
                      <Image
                        src={teacher.profiles.avatar_url}
                        alt={`${teacher.profiles?.name} avatar`}
                        fill
                        sizes="(max-w-768px) 128px, 160px"
                        className="object-cover rounded-[1.8rem] md:rounded-[2.8rem]"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl overflow-hidden">
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
                        {getTranslation(translatedSubject).join(", ")}
                      </span>
                      <div className="flex flex-wrap gap-3 sm:justify-start justify-center">
                        <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-full text-sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {t("reviews_count", { count: comments.length })}
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

            <section className="bg-white rounded-3xl min-h-83 md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Award className="text-blue-500 w-6 h-6 md:w-7 md:h-7" />
                {t("about_teacher")}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-line italic">
                &quot;{teacher?.description || t("no_description")}&quot;
              </p>
            </section>
          </div>

          {/* ПРАВАЯ КОЛОНКА (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6 bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200 shadow-xl">
              <div className="mb-8">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest block mb-2">
                  {t("lesson_price")}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-slate-900">
                    {(teacher?.price).toLocaleString() || "0"}
                  </span>
                  <span className="text-slate-500 font-bold text-lg">UZS</span>
                </div>
              </div>

              <hr className="my-8 border-slate-100" />

              <div className="space-y-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-500" /> {t("contacts")}
                </h3>
                <div className="bg-blue-50/50 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-blue-100/50 relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-slate-700 font-semibold leading-relaxed break-words text-sm md:text-base">
                      {teacher.contacts || t("no_contacts")}
                    </p>
                  </div>
                  <Globe className="absolute -bottom-4 -right-4 w-20 h-20 text-blue-100 opacity-40 group-hover:rotate-12 transition-transform" />
                </div>
              </div>

              <hr className="my-6 border-slate-100" />

              <div className="space-y-4">
                {profileData?.availability && (
                  <FreeTimeBar
                    initialSchedule={{ availability: profileData.availability }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <section
          id="reviews"
          className="bg-white lg:col-span-8 mt-6 rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-10 border border-slate-200 shadow-sm space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
              <MessageSquare className="text-blue-500 w-6 h-6 md:w-7 md:h-7" />
              {t("student_reviews")}
            </h2>
          </div>
          <CommentForm adId={adData.id} comments={comments} />
          <hr className="border-slate-100" />
          <CommentsList comments={comments} />
        </section>
      </div>
    </main>
  );
}
