import React, { useEffect, useRef, useState } from "react";
import { createClient } from "../../../src/utils/supabase/client";
import { useTeacherAnnouncement } from "../../context/TeacherAnnouncementContext";

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

// Парсим цену типа "40,000 UZS" → 40000
const parsePrice = (priceStr: string): number =>
  parseInt(priceStr.replace(/\D/g, ""), 10);

const FilterPanel = ({ filters, setFilters, onClose }: FilterPanelProps) => {
  const { announcements, setAnnouncements } = useTeacherAnnouncement();
  const [subjects, setSubjects] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const originalRef = useRef<any[]>([]);

  // Запоминаем оригинал при первом получении данных
  useEffect(() => {
    if (announcements.length > 0 && originalRef.current.length === 0) {
      originalRef.current = announcements;
    }
  }, [announcements]);

  // Загружаем предметы из Supabase
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from("subjects").select("subject");
      if (error) {
        console.error("[FilterPanel] Ошибка загрузки предметов:", error);
      } else {
        setSubjects(data.map((item) => item.subject));
      }
    };
    fetchSubjects();
  }, []);

  // Закрываем панель при клике вне её
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
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Фильтруем всегда из оригинала, не из текущего состояния
    let result = originalRef.current.filter((ad: any) => {
      const matchSubject = filters.subject
        ? ad.subject.toLowerCase().includes(filters.subject.toLowerCase())
        : true;
      const matchPrice = parsePrice(ad.price) <= filters.maxPrice;
      return matchSubject && matchPrice;
    });

    if (filters.sortByLikes) {
      result = [...result].sort((a, b) => b.likes - a.likes);
    } else if (filters.sortAscPrice) {
      result = [...result].sort(
        (a, b) => parsePrice(a.price) - parsePrice(b.price),
      );
    } else if (filters.sortDescPrice) {
      result = [...result].sort(
        (a, b) => parsePrice(b.price) - parsePrice(a.price),
      );
    }

    setAnnouncements(result);
    console.log("Подходящие уроки:", announcements);
    
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
    // Восстанавливаем оригинальный список
    setAnnouncements(originalRef.current);
  };

  return (
    <div
      ref={filterRef}
      className="bg-white absolute right-4 top-14 z-10 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm w-[calc(100vw-2rem)] sm:w-72 max-w-sm"
    >
      <h3 className="text-base sm:text-lg font-bold mb-4">Фильтры</h3>

      {/* Предмет */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Предмет
        </label>
        <input
          list="subjects-list"
          type="text"
          placeholder="Поиск или ввод..."
          className="w-full p-2 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          value={filters.subject}
          onChange={(e) => updateFilter("subject", e.target.value)}
        />
        <datalist id="subjects-list">
          {subjects.map((sub) => (
            <option key={sub} value={sub} />
          ))}
        </datalist>
      </div>

      {/* Цена */}
      <div className="mb-4 sm:mb-6">
        <label className="flex justify-between text-xs sm:text-sm font-medium text-gray-700 mb-2">
          <span>Цена за час:</span>
          <span className="font-bold text-blue-600">
            {filters.maxPrice.toLocaleString()} UZS
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="500000"
          step="5000"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", Number(e.target.value))}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0</span>
          <span>500 000</span>
        </div>
      </div>

      {/* Сортировка */}
      {[
        {
          id: "sortByLikes",
          key: "sortByLikes" as const,
          label: "По количеству лайков",
        },
        {
          id: "sortAscPrice",
          key: "sortAscPrice" as const,
          label: "Сначала низкие цены",
        },
        {
          id: "sortDescPrice",
          key: "sortDescPrice" as const,
          label: "Сначала высокие цены",
        },
      ].map(({ id, key, label }) => (
        <div key={id} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={id}
            checked={filters[key]}
            onChange={(e) => updateFilter(key, e.target.checked)}
          />
          <label
            htmlFor={id}
            className="ml-2 text-xs sm:text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        </div>
      ))}

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleApplyFilters}
          className="w-full py-2 sm:py-2.5 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-blue-700 transition-all active:scale-95"
        >
          Применить
        </button>
        <button
          onClick={handleReset}
          className="w-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-all active:scale-95"
        >
          Сбросить все
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
