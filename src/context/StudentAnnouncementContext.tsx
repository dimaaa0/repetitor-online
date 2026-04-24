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
            profiles (
              name,
              surname,
              avatar_url
            )
          `);

      if (error) {
        console.error("Ошибка загрузки:", error);
      } else {
        const formattedData = data.map((ad: any) => ({
          id: ad.id,
          title: ad.title,
          name: ad.profiles?.name,
          surname: ad.profiles?.surname,
          avatar: ad.profiles?.avatar_url,
          subject: ad.subject,
          description: ad.description,
          price: ad.price + " UZS",
          likes: 0,
        }));
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
