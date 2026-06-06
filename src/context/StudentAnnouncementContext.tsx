"use client";
import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";
import { useTranslations } from "next-intl";

const StudentAnnouncementContext = createContext<any>(null);

interface RawAdItem {
  id: string;
  title: string;
  subject: string; // Из базы приходит строго 'subject'
  description: string;
  price: number;
  created_at: string;
  profiles?: {
    id: string;
    name: string;
    surname: string;
    avatar_url: string;
    is_banned: boolean;
  } | null;
}

// Шаг 1: Чистая функция БЕЗ хуков. Только нормализация структуры.
const transformStudentAds = (data: RawAdItem[]) => {
  if (!data) return [];
  return data
    .filter((ad) => !ad.profiles?.is_banned)
    .map((ad) => ({
      id: ad.id,
      title: ad.title,
      subjectKey: ad.subject, // Запоминаем сырое значение как ключ для будущего перевода
      description: ad.description,
      priceRaw: ad.price,
      postedAt: ad.created_at,
      user_id: ad.profiles?.id,
      name: ad.profiles?.name,
      surname: ad.profiles?.surname,
      avatar: ad.profiles?.avatar_url,
    }));
};

const EMPTY_ARRAY: any[] = [];

export const StudentAnnouncementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClient();
  // Хук вызывается строго внутри компонента-провайдера!
  const tSubjects = useTranslations("subjects_list");

  const {
    data: rawAnnouncements,
    isLoading: announcementsLoading,
    refetch,
  } = useQuery({
    queryKey: ["student-announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("student_ads").select(`
          id,
          title,
          subject,
          description,
          price,
          created_at,
          profiles (
            id,
            name,
            surname,
            avatar_url,
            is_banned
          )
        `);
      if (error) throw new Error(error.message);
      return (data as unknown as RawAdItem[]) || [];
    },
    select: transformStudentAds,
    staleTime: 5 * 60 * 1000,
  });

  // Шаг 3: Переводы и форматирование строк происходят «на лету» в UI-слое
  const announcements = useMemo(() => {
    if (!rawAnnouncements) return EMPTY_ARRAY;

    return rawAnnouncements.map((ad) => ({
      ...ad,
      // Переводим здесь, используя подготовленный subjectKey
      subject: tSubjects.has(ad.subjectKey)
        ? tSubjects(ad.subjectKey)
        : ad.subjectKey,
      price: ad.priceRaw + " UZS",
    }));
  }, [rawAnnouncements, tSubjects]); // tSubjects в зависимостях перерисует язык мгновенно

  return (
    <StudentAnnouncementContext.Provider
      value={{
        announcements,
        announcementsLoading,
        refreshAnnouncements: refetch,
        rawAnnouncements: rawAnnouncements || EMPTY_ARRAY,
      }}
    >
      {children}
    </StudentAnnouncementContext.Provider>
  );
};

export const useStudentAnnouncement = () =>
  useContext(StudentAnnouncementContext);
