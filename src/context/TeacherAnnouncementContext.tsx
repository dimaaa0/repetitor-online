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
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setAnnouncementsLoading(true);
      const { data, error } = await supabase.from("ads").select(`
            id,
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
          name: ad.profiles?.name,
          surname: ad.profiles?.surname,
          avatar: ad.profiles?.avatar_url,
          subject: ad.subject,
          description: ad.description,
          price: ad.price + " UZS",
          likes: 67,
        }));
        setAnnouncements(formattedData);
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
      }}
    >
      {children}
    </TutorAnnouncementContext.Provider>
  );
};


export const useTeacherAnnouncement = () => useContext(TutorAnnouncementContext);
