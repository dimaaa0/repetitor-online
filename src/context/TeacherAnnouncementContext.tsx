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

  // Храним данные объявления здесь, чтобы они были доступны везде
  const [announcements, setAnnouncements] = useState<any>(null);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  // Функция для загрузки данных (можно вызвать при логине или загрузке страницы)
  const fetchAnnouncement = async () => {
    setAnnouncementsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error) setAnnouncements(data);
    }
    setAnnouncementsLoading(false);
  };

  // Загружаем данные один раз при монтировании провайдера
  useEffect(() => {
    fetchAnnouncement();
  }, []);

  return (
    <TutorAnnouncementContext.Provider
      value={{
        announcements,
        setAnnouncements,
        refreshAnnouncements: fetchAnnouncement,
        announcementsLoading,
      }}
    >
      {children}
    </TutorAnnouncementContext.Provider>
  );
};

// Хук для удобного использования
export const useTutorAnnouncement = () => useContext(TutorAnnouncementContext);
