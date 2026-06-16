"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";
import { useTranslations } from "next-intl";

const StudentAnnouncementContext = createContext<any>(null);

interface Filters {
  subject: string;
  maxPrice: number;
  sortByLikes: boolean;
  sortAscPrice: boolean;
  sortDescPrice: boolean;
}

const initialFilters: Filters = {
  subject: "",
  maxPrice: 500000,
  sortByLikes: false,
  sortAscPrice: false,
  sortDescPrice: false,
};

interface RawAdItem {
  id: string;
  title: string;
  subject: string;
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

const parsePrice = (priceStr: any): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  return parseInt(priceStr.toString().replace(/\D/g, ""), 10) || 0;
};

const transformStudentAds = (data: RawAdItem[]) => {
  if (!data) return [];
  return data
    .filter((ad) => !ad.profiles?.is_banned)
    .map((ad) => ({
      id: ad.id,
      title: ad.title,
      subjectKey: ad.subject,
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
  const tSubjects = useTranslations("subjects_list");

  // Храним примененные фильтры в контексте
  const [globalFilters, setGlobalFilters] = useState<Filters>(initialFilters);

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

  // 1. Фильтруем сырые данные на основе глобальных фильтров
  const filteredRawAnnouncements = useMemo(() => {
    let result = [...(rawAnnouncements || [])];

    // Фильтрация по цене
    result = result.filter(
      (ad) => parsePrice(ad.priceRaw) <= globalFilters.maxPrice,
    );

    // Фильтрация по предметам
    if (globalFilters.subject) {
      const userSearch = globalFilters.subject.toLowerCase().trim();

      result = result.filter((ad) => {
        if (!ad.subjectKey) return false;
        return ad.subjectKey
          .split(",")
          .map((s: string) => s.trim())
          .some((key: string) => {
            const systemKeyMatches = key.toLowerCase().includes(userSearch);
            const translatedMatches = tSubjects.has(key)
              ? tSubjects(key).toLowerCase().includes(userSearch)
              : key.toLowerCase().includes(userSearch);
            return systemKeyMatches || translatedMatches;
          });
      });
    }

    // Сортировка
    if (globalFilters.sortAscPrice) {
      result.sort((a, b) => parsePrice(a.priceRaw) - parsePrice(b.priceRaw));
    } else if (globalFilters.sortDescPrice) {
      result.sort((a, b) => parsePrice(b.priceRaw) - parsePrice(a.priceRaw));
    }

    return result;
  }, [rawAnnouncements, globalFilters, tSubjects]);

  // 2. Форматируем отфильтрованный список для вывода в карточки UI
  const announcements = useMemo(() => {
    return filteredRawAnnouncements.map((ad) => {
      const processSubjects = (key: string) => {
        if (typeof key !== "string") return key;
        return key
          .split(",")
          .map((s) => s.trim())
          .map((s) => {
            if (!tSubjects.has(s)) return s;

            try {
              // Получаем "сырые" данные (это может быть и строка, и объект)
              const rawValue = tSubjects.raw(s);

              // Если это объект узбекского языка, берем поле name
              if (
                rawValue &&
                typeof rawValue === "object" &&
                "name" in rawValue
              ) {
                return rawValue.name;
              }

              // Для русского/английского возвращаем обычный перевод строки
              return tSubjects(s);
            } catch (e) {
              return s; // фолбек на случай непредвиденной ошибки
            }
          })
          .join(", ");
      };

      return {
        id: ad.id,
        title: ad.title,
        name: ad.name,
        surname: ad.surname,
        avatar: ad.avatar,
        subject: processSubjects(ad.subjectKey),
        description: ad.description,
        postedAt: ad.postedAt,
        price: parsePrice(ad.priceRaw).toLocaleString() + " UZS",
      };
    });
  }, [filteredRawAnnouncements, tSubjects]);

  return (
    <StudentAnnouncementContext.Provider
      value={{
        announcements, // Этот массив автоматически будет отфильтрован
        announcementsLoading,
        refreshAnnouncements: refetch,
        originalAnnouncements: rawAnnouncements || EMPTY_ARRAY, // Нужен для живого счетчика в панели
        globalFilters,
        setGlobalFilters,
      }}
    >
      {children}
    </StudentAnnouncementContext.Provider>
  );
};

export const useStudentAnnouncement = () =>
  useContext(StudentAnnouncementContext);
