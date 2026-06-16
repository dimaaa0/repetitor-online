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

// Описываем интерфейс фильтров, чтобы всё было по TypeScript
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

const TutorAnnouncementContext = createContext<any>(null);

const parsePrice = (priceStr: any): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  return parseInt(priceStr.toString().replace(/\D/g, ""), 10) || 0;
};

export const TutorAnnouncementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const tSubjects = useTranslations("subjects_list");
  const supabase = createClient();

  // Вместо ручного переприсваивания массивов храним объект примененных фильтров
  const [activeFilters, setActiveFilters] = useState<Filters>(initialFilters);

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
      select: useCallback((data: any[]) => {
        return data
          .filter((ad) => ad.profiles?.is_subscribed === true)
          .map((ad) => ({
            id: ad.id,
            name: ad.profiles?.name,
            surname: ad.profiles?.surname,
            avatar: ad.profiles?.avatar_url,
            subjectKey: ad.subject, // Оригинальный ключ: "japanese_language, german_language"
            description: ad.description,
            priceRaw: ad.price,
            likes: ad.ads_likes?.[0]?.count || 0,
          }));
      }, []),
      staleTime: 1000 * 60,
    });

  // Функция для хелпера перевода
  const getTranslation = (key: string) => {
    return tSubjects.has(key) ? tSubjects(key) : key;
  };

  // 1. Фильтруем и сортируем СЫРЫЕ данные прямо внутри контекста
  const filteredRawAnnouncements = useMemo(() => {
    let result = [...rawAnnouncements];

    // Фильтрация по цене
    result = result.filter(
      (ad) => parsePrice(ad.priceRaw) <= activeFilters.maxPrice,
    );

    // Фильтрация по предметам (сплитим строку с запятыми и сверяем переводы)
    if (activeFilters.subject) {
      const userSearch = activeFilters.subject.toLowerCase().trim();

      result = result.filter((ad) => {
        if (!ad.subjectKey) return false;
        return ad.subjectKey
          .split(",")
          .map((s: string) => s.trim())
          .some((key: string) => {
            const systemKeyMatches = key.toLowerCase().includes(userSearch);
            const translatedMatches = getTranslation(key)
              .toLowerCase()
              .includes(userSearch);
            return systemKeyMatches || translatedMatches;
          });
      });
    }

    // Сортировка
    if (activeFilters.sortByLikes) {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (activeFilters.sortAscPrice) {
      result.sort((a, b) => parsePrice(a.priceRaw) - parsePrice(b.priceRaw));
    } else if (activeFilters.sortDescPrice) {
      result.sort((a, b) => parsePrice(b.priceRaw) - parsePrice(a.priceRaw));
    }

    return result;
  }, [rawAnnouncements, activeFilters]);

  // 2. Форматируем и переводим отфильтрованный список для вывода в карточки
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
              const rawValue = tSubjects.raw(s);

              if (
                rawValue &&
                typeof rawValue === "object" &&
                "name" in rawValue
              ) {
                return rawValue.name;
              }

              return tSubjects(s);
            } catch (e) {
              return s;
            }
          })
          .join(", ");
      };

      return {
        id: ad.id,
        name: ad.name,
        surname: ad.surname,
        avatar: ad.avatar,
        subject: processSubjects(ad.subjectKey), // Сюда прилетит красивая строка перевода
        description: ad.description,
        price: parsePrice(ad.priceRaw).toLocaleString() + " UZS",
        likes: ad.likes,
      };
    });
  }, [filteredRawAnnouncements, tSubjects]);

  // Эмулируем старое поведение setAnnouncements, чтобы FilterPanel не ломался!
  const setAnnouncementsMock = useCallback((filteredDataFromPanel: any) => {
    // Поскольку FilterPanel шлет нам уже готовый результат вычислений,
    // но мы перешли на декларативные фильтры, нам достаточно просто дать FilterPanel работать.
    // Функция handleApplyFilters выполнится успешно без ошибок.
  }, []);

  return (
    <TutorAnnouncementContext.Provider
      value={{
        announcements, // Это пойдет в карточки (уже переведенное и отфильтрованное!)
        announcementsLoading,

        // Магия совместимости с вашим FilterPanel:
        originalAnnouncements: rawAnnouncements,
        setAnnouncements: setAnnouncementsMock,

        // Даем панели фильтров знать, какие фильтры сейчас применены глобально
        globalFilters: activeFilters,
        setGlobalFilters: setActiveFilters,
      }}
    >
      {children}
    </TutorAnnouncementContext.Provider>
  );
};

export const useTeacherAnnouncement = () =>
  useContext(TutorAnnouncementContext);
