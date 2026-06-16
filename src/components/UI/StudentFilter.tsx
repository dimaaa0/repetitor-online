"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "../../utils/supabase/client";
import { useStudentAnnouncement } from "../../context/StudentAnnouncementContext";

const supabase = createClient();

interface Filters {
  subject: string;
  maxPrice: number;
  sortByLikes: boolean;
  sortAscPrice: boolean;
  sortDescPrice: boolean;
}

interface FilterPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClose?: () => void;
}

const parsePrice = (priceStr: any): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  return parseInt(priceStr.toString().replace(/\D/g, ""), 10) || 0;
};

const FilterPanel = ({ filters, setFilters, onClose }: FilterPanelProps) => {
  const t = useTranslations("StudentFilter");
  const tSubjects = useTranslations("subjects_list");

  // Достаем новые методы управления из обновленного контекста
  const { setGlobalFilters, globalFilters, originalAnnouncements } =
    useStudentAnnouncement();
  const [subjects, setSubjects] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const getTranslation = (key: string) => {
    if (!tSubjects.has(key)) return key;

    try {
      // Используем .raw(), чтобы получить чистые данные из JSON (строку или объект)
      const rawValue = tSubjects.raw(key);

      // Если это узбекский вариант (объект, у которого есть поле name)
      if (rawValue && typeof rawValue === "object" && "name" in rawValue) {
        return rawValue.name; // Возвращаем только "matematika"
      }

      // Если это русский или английский (где в JSON сразу лежит строка)
      return tSubjects(key);
    } catch (e) {
      // Фолбек на случай, если .raw() выдаст ошибку
      return tSubjects(key);
    }
  };

  // Синхронизируем локальные фильтры с уже примененными в системе при открытии
  useEffect(() => {
    if (globalFilters) {
      setFilters(globalFilters);
    }
  }, [globalFilters, setFilters]);

  // Загрузка списка предметов для datalist
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from("subjects").select("subject");
      if (error) {
        console.error("[FilterPanel] Ошибка загрузки предметов:", error);
      } else if (data) {
        setSubjects(data.map((item) => item.subject));
      }
    };
    fetchSubjects();
  }, []);

  const translatedSubjects = useMemo(() => {
    return subjects.map((sub) => getTranslation(sub));
  }, [subjects]);

  const previewCount = useMemo(() => {
    if (!originalAnnouncements) return 0;

    let result = originalAnnouncements.filter((ad: any) => {
      const matchPrice = parsePrice(ad.priceRaw) <= filters.maxPrice;

      if (filters.subject) {
        const userSearch = filters.subject.toLowerCase().trim();
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
      }
      return matchPrice;
    });

    return result.length;
  }, [filters, originalAnnouncements, tSubjects]);

  // Закрытие панели при клике вне её
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      if (key === "sortAscPrice" && value === true) {
        newFilters.sortDescPrice = false;
        newFilters.sortByLikes = false;
      }
      if (key === "sortDescPrice" && value === true) {
        newFilters.sortAscPrice = false;
        newFilters.sortByLikes = false;
      }
      if (key === "sortByLikes" && value === true) {
        newFilters.sortAscPrice = false;
        newFilters.sortDescPrice = false;
      }

      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    if (typeof setGlobalFilters === "function") {
      setGlobalFilters(filters); // Отправляем стейт в контекст, главный экран обновится
      onClose?.();
    }
  };

  const handleReset = () => {
    const defaultFilters = {
      subject: "",
      maxPrice: 500000,
      sortByLikes: false,
      sortAscPrice: false,
      sortDescPrice: false,
    };
    setFilters(defaultFilters);
    if (typeof setGlobalFilters === "function") {
      setGlobalFilters(defaultFilters);
    }
  };

  return (
    <div
      ref={filterRef}
      className="bg-white absolute right-0 top-14 z-10 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xl w-[calc(100vw-1rem)] sm:w-72 max-w-sm transition-all duration-300"
    >
      <h3 className="text-base sm:text-lg font-bold mb-4">
        {t("title_filters")}
      </h3>

      {/* Выбор предмета */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          {t("label_subject")}
        </label>
        <input
          list="subjects-list"
          type="text"
          placeholder={t("placeholder_search_or_type")}
          className="w-full p-2 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all"
          value={filters.subject}
          onChange={(e) => updateFilter("subject", e.target.value)}
        />
        <datalist id="subjects-list">
          {translatedSubjects.map((sub) => (
            <option key={sub} value={sub} />
          ))}
        </datalist>
      </div>

      {/* Ползунок цены */}
      <div className="mb-4 sm:mb-6">
        <label className="flex justify-between text-xs sm:text-sm font-medium text-gray-700 mb-2">
          <span>{t("label_price_to")}</span>
          <span className="font-bold text-blue-600">
            {filters.maxPrice.toLocaleString()} UZS
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="500000"
          step="10000"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{t("price_min")}</span>
          <span>{t("price_max")}</span>
        </div>
      </div>

      {/* Сортировка */}
      <div className="space-y-2 mb-6">
        {[
          {
            id: "sortAscPrice",
            key: "sortAscPrice" as const,
            label: t("sort_cheaper_first"),
          },
          {
            id: "sortDescPrice",
            key: "sortDescPrice" as const,
            label: t("sort_expensive_first"),
          },
        ].map(({ id, key, label }) => (
          <div key={id} className="flex items-center">
            <input
              type="checkbox"
              id={id}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              checked={filters[key]}
              onChange={(e) => updateFilter(key, e.target.checked)}
            />
            <label
              htmlFor={id}
              className="ml-2 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
            >
              {label}
            </label>
          </div>
        ))}
      </div>

      {/* Кнопки действий */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleApplyFilters}
          className="w-full py-2.5 bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-blue-100"
        >
          {t("btn_apply")}
        </button>
        <button
          onClick={handleReset}
          className="w-full py-2.5 text-xs sm:text-sm font-medium text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-all active:scale-95"
        >
          {t("btn_reset")}
        </button>
      </div>

      {/* Счетчик результатов в реальном времени */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
        <p className="text-xs sm:text-sm font-medium text-gray-500">
          {t("found_lessons", { count: previewCount })}
        </p>
      </div>
    </div>
  );
};

export default FilterPanel;
