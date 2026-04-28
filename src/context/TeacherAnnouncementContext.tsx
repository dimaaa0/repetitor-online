"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

const TutorAnnouncementContext = createContext<any>(null);

export const TutorAnnouncementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClient();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [originalAnnouncements, setOriginalAnnouncements] = useState<any[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setAnnouncementsLoading(true);

      // 1. Добавляем запрос количества из связанной таблицы ads_likes
      const { data, error } = await supabase.from("ads").select(`
            id,
            subject,
            description,
            price,
            profiles:user_id (
              name,
              surname,
              avatar_url
            ),
            ads_likes (count) 
          `);

      if (error) {
        console.error("Ошибка загрузки:", error.message);
      } else {
        const formattedData = data.map((ad: any) => ({
          id: ad.id,
          name: ad.profiles?.name,
          surname: ad.profiles?.surname,
          avatar: ad.profiles?.avatar_url,
          subject: ad.subject,
          description: ad.description,
          price: ad.price + " UZS",
          // 2. Достаем count из массива ads_likes
          // Supabase возвращает массив объектов, берем первый и его свойство count
          likes: ad.ads_likes?.[0]?.count || 0,
        }));

        setAnnouncements(formattedData);
        setOriginalAnnouncements(formattedData);
      }
      setAnnouncementsLoading(false);
    };

    fetchTeachers();
  }, []);

  return (
    <TutorAnnouncementContext.Provider
      value={{
        announcements,
        setAnnouncements,
        announcementsLoading,
        originalAnnouncements,
      }}
    >
      {children}
    </TutorAnnouncementContext.Provider>
  );
};

export const useTeacherAnnouncement = () =>
  useContext(TutorAnnouncementContext);
