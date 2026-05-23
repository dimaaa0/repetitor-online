"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

const StudentAnnouncementContext = createContext<any>(null);

export const StudentAnnouncementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClient();

  // Храним данные объявления здесь, чтобы они были доступны везде
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [originalAnnouncements, setOriginalAnnouncements] = useState<any[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  // Функция для загрузки данных (можно вызвать при логине или загрузке страницы)
  const fetchAnnouncement = async () => {
    setAnnouncementsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("student_ads")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error) setAnnouncements(data);
    }
    setAnnouncementsLoading(false);
  };

  // Загружаем данные один раз при монтировании провайдера
  useEffect(() => {
  const fetchAllAnnouncements = async () => {
    setAnnouncementsLoading(true);
    
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

    if (error) {
      console.error("Ошибка загрузки:", error);
    } else {
      // Используем reduce вместо map, чтобы одновременно фильтровать и форматировать
      const formattedData = data.reduce((acc: any[], ad: any) => {
        // ЕСЛИ профиль забанен — просто пропускаем это объявление
        if (ad.profiles?.is_banned === true) {
          return acc; 
        }

        // Иначе — форматируем и добавляем в итоговый массив
        acc.push({
          id: ad.id,
          title: ad.title,
          name: ad.profiles?.name,
          surname: ad.profiles?.surname,
          avatar: ad.profiles?.avatar_url,
          subject: ad.subject,
          description: ad.description,
          price: ad.price + " UZS",
          likes: 0,
          postedAt: ad.created_at,
          user_id: ad.profiles?.id,
          is_banned: ad.profiles?.is_banned
        });

        return acc;
      }, []); // Начальное значение — пустой массив

      setAnnouncements(formattedData);
      setOriginalAnnouncements(formattedData);
    }
    setAnnouncementsLoading(false);
  };

  fetchAllAnnouncements();
}, []);

  return (
    <StudentAnnouncementContext.Provider
      value={{
        announcements,
        setAnnouncements,
        refreshAnnouncements: fetchAnnouncement,
        announcementsLoading,
        originalAnnouncements,
      }}
    >
      {children}
    </StudentAnnouncementContext.Provider>
  );
};

// Хук для удобного использования
export const useStudentAnnouncement = () =>
  useContext(StudentAnnouncementContext);
