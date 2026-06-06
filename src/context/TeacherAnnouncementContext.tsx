"use client";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";
import { useTranslations } from "next-intl";

const TutorAnnouncementContext = createContext<any>(null);

export const TutorAnnouncementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const tSubjects = useTranslations("subjects_list");
  const supabase = createClient();

  // Вместо хранения отфильтрованного массива храним только активные фильтры
  // Например, id выбранного предмета, или null, если фильтр не применен
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const { data: rawAnnouncements = [], isLoading: announcementsLoading } =
    useQuery({
      queryKey: ["tutor-announcements"],
      queryFn: async () => {
        const { data, error } = await supabase.from("ads").select(`
          id,
          subject,
          description,
          price,
          profiles:user_id (
            name,
            surname,
            avatar_url,
            is_subscribed
          ),
          ads_likes (count) 
        `);

        if (error) throw new Error(error.message);
        return data || [];
      },
      // В select делаем ТОЛЬКО нормализацию структуры БД. Без переводов!
      // Оборачиваем в useCallback, чтобы ссылка не менялась и кэш React Query работал идеально
      select: useCallback((data: any[]) => {
        return data
          .filter((ad) => ad.profiles?.is_subscribed === true)
          .map((ad) => ({
            id: ad.id,
            name: ad.profiles?.name,
            surname: ad.profiles?.surname,
            avatar: ad.profiles?.avatar_url,
            subjectKey: ad.subject, // Сохраняем сырой КЛЮЧ для перевода
            description: ad.description,
            priceRaw: ad.price, // Оставляем числом (пригодится для сортировки по цене)
            likes: ad.ads_likes?.[0]?.count || 0,
          }));
      }, []),
      staleTime: 1000 * 60,
    });

  // 1. Сначала фильтруем СЫРЫЕ данные (по ссылке из кэша)
  const filteredRawAnnouncements = useMemo(() => {
    if (!selectedSubject) return rawAnnouncements;
    return rawAnnouncements.filter((ad) => ad.subjectKey === selectedSubject);
  }, [rawAnnouncements, selectedSubject]);

  // 2. И только теперь ПЕРЕВОДИМ и форматируем итоговый список.
  // Этот useMemo сработает мгновенно при смене языка (tSubjects) без запросов в БД!
   const announcements = useMemo(() => {
    return filteredRawAnnouncements.map((ad) => {
      const processSubjects = (key: string) => {
        if (typeof key !== "string") return key;
        return key
          .split(",")
          .map((s) => s.trim())
          .map((s) => (tSubjects.has(s) ? tSubjects(s) : s))
          .join(", ");
      };

      return {
        id: ad.id,
        name: ad.name,
        surname: ad.surname,
        avatar: ad.avatar,
        subject: processSubjects(ad.subjectKey),
        description: ad.description,
        price: ad.priceRaw + " UZS",
        likes: ad.likes,
      };
    });
  }, [filteredRawAnnouncements, tSubjects]);

  return (
    <TutorAnnouncementContext.Provider
      value={{
        announcements, // Компоненты получают актуальные переведенные и отфильтрованные данные
        announcementsLoading,
        setSubjectFilter: setSelectedSubject, // Передаем функцию изменения фильтра кнопкам
        activeSubject: selectedSubject,
      }}
    >
      {children}
    </TutorAnnouncementContext.Provider>
  );
};

export const useTeacherAnnouncement = () =>
  useContext(TutorAnnouncementContext);
