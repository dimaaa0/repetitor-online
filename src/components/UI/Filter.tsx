import React, { useEffect, useRef, useState, useMemo } from "react";
import { createClient } from "../../../src/utils/supabase/client";
import { useTeacherAnnouncement } from "../../context/TeacherAnnouncementContext";
import { useDebounce } from "../../app/functions/useDebounce";

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

// Утилита для парсинга цены: "100,000 UZS" -> 100000
const parsePrice = (priceStr: any): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  return parseInt(priceStr.toString().replace(/\D/g, ""), 10) || 0;
};

const FilterPanel = ({ filters, setFilters, onClose }: FilterPanelProps) => {
  const { setAnnouncements, originalAnnouncements } = useTeacherAnnouncement();
  const [subjects, setSubjects] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const debouncedFilters = useDebounce(filters, 300);

  // 1. Загрузка списка предметов для выпадающего списка
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

  // 2. Логика фильтрации и сортировки (Вынесена в useMemo для производительности)
  const filteredResult = useMemo(() => {
    let result = originalAnnouncements.filter((ad: any) => {
      const matchSubject = debouncedFilters.subject
        ? ad.subject
            ?.toLowerCase()
            .trim()
            .includes(debouncedFilters.subject.toLowerCase().trim())
        : true;
      const matchPrice = parsePrice(ad.price) <= debouncedFilters.maxPrice;
      return matchSubject && matchPrice;
    });

    if (debouncedFilters.sortByLikes) {
      result = [...result].sort((a: any, b: any) => b.likes - a.likes);
    } else if (debouncedFilters.sortAscPrice) {
      result = [...result].sort(
        (a: any, b: any) => parsePrice(a.price) - parsePrice(b.price),
      );
    } else if (debouncedFilters.sortDescPrice) {
      result = [...result].sort(
        (a: any, b: any) => parsePrice(b.price) - parsePrice(a.price),
      );
    }

    return result;
  }, [debouncedFilters, originalAnnouncements]);

  // 3. Закрытие панели при клике вне её
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

      // Если включаем "Сначала дешевле", выключаем "Сначала дороже"
      if (key === "sortAscPrice" && value === true) {
        newFilters.sortDescPrice = false;
      }

      // Если включаем "Сначала дороже", выключаем "Сначала дешевле"
      if (key === "sortDescPrice" && value === true) {
        newFilters.sortAscPrice = false;
      }

      // Дополнительно: если включаем любую сортировку по цене,
      // можно выключать сортировку по лайкам (если хочешь только один активный тип)
      if (
        (key === "sortAscPrice" || key === "sortDescPrice") &&
        value === true
      ) {
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
    setAnnouncements(filteredResult);
    onClose?.();
  };

  const handleReset = () => {
    setFilters({
      subject: "",
      maxPrice: 500000,
      sortByLikes: false,
      sortAscPrice: false,
      sortDescPrice: false,
    });
    setAnnouncements(originalAnnouncements);
  };

  console.log(filters);

  return (
    <div
      ref={filterRef}
      className="bg-white absolute right-0 top-14 z-10 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xl w-[calc(100vw-1rem)] sm:w-72 max-w-sm transition-all duration-300"
    >
      <h3 className="text-base sm:text-lg font-bold mb-4">Фильтры</h3>

      {/* Выбор предмета */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Предмет
        </label>
        <input
          list="subjects-list"
          type="text"
          placeholder="Поиск или ввод..."
          className="w-full p-2 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all"
          value={filters.subject}
          onChange={(e) => updateFilter("subject", e.target.value)}
        />
        <datalist id="subjects-list">
          {subjects.map((sub) => (
            <option key={sub} value={sub} />
          ))}
        </datalist>
      </div>

      {/* Ползунок цены */}
      <div className="mb-4 sm:mb-6">
        <label className="flex justify-between text-xs sm:text-sm font-medium text-gray-700 mb-2">
          <span>Цена до:</span>
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
          <span>0</span>
          <span>500 000</span>
        </div>
      </div>

      {/* Сортировка (Чекбоксы) */}
      <div className="space-y-2 mb-6">
        {[
          {
            id: "sortByLikes",
            key: "sortByLikes" as const,
            label: "По популярности",
          },
          {
            id: "sortAscPrice",
            key: "sortAscPrice" as const,
            label: "Сначала дешевле",
          },
          {
            id: "sortDescPrice",
            key: "sortDescPrice" as const,
            label: "Сначала дороже",
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
          Применить
        </button>
        <button
          onClick={handleReset}
          className="w-full py-2.5 text-xs sm:text-sm font-medium text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-all active:scale-95"
        >
          Сбросить всё
        </button>
      </div>

      {/* Счетчик результатов в реальном времени */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
        <p className="text-xs sm:text-sm font-medium text-gray-500">
          Найдено уроков:{" "}
          <span className="text-gray-800 font-bold">
            {filteredResult.length}
          </span>
        </p>
      </div>
    </div>
  );
};

export default FilterPanel;
