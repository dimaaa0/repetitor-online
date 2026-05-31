import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSubject } from "../../context/StudentSubjectContext";
import { createClient } from "../../../src/utils/supabase/client";
import { useUser } from "../../context/UserContext";
import { useTranslations } from "next-intl";

// Оставляем один вызов клиента Supabase вне компонента
const supabase = createClient();

const SubjectPicker = () => {
  const { selectedSubjects, addSubject, removeSubject } = useSubject();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("profiles");
  const tSubjects = useTranslations("subjects_list");

  const { user, loading, refreshUser } = useUser();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Безопасная функция перевода (если ключа нет в JSON, вернет сам ключ)
  const getTranslation = (key: string) => {
    return tSubjects.has(key) ? tSubjects(key) : key;
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("subjects").select("subject");
      if (error) {
        console.error("Ошибка загрузки предметов:", error);
      } else {
        // Храним в стейте чистые ключи из базы (math, physics...)
        const subjectKeys = data.map((item) => item.subject);
        setSubjects(subjectKeys);
      }
      setIsLoading(false);
    };

    fetchSubjects();
  }, []);

  // Фильтруем предметы по их ПЕРЕВЕДЕННОМУ значению
  const filteredSubjects = useMemo(() => {
    return subjects
      .filter((key) => !selectedSubjects.includes(key))
      .filter((key) => {
        const translatedName = getTranslation(key).toLowerCase();
        return translatedName.includes(query.toLowerCase());
      });
  }, [subjects, query, selectedSubjects]);

  const addSubjectLocal = (subjectKey: string) => {
    const trimmed = subjectKey.trim();
    if (trimmed && !selectedSubjects.includes(trimmed)) {
      addSubject(trimmed);
    }
    setQuery("");
  };

  const removeSubjectLocal = (subjectKeyToRemove: string) => {
    removeSubject(subjectKeyToRemove);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Если пользователь жмет Enter, ищем точное совпадение по переводу
      const matchedSubject = filteredSubjects.find(
        (key) =>
          getTranslation(key).toLowerCase() === query.trim().toLowerCase(),
      );

      if (matchedSubject) {
        addSubjectLocal(matchedSubject);
        setIsOpen(false);
      } else if (filteredSubjects.length > 0) {
        // Если точного совпадения нет, но есть отфильтрованный список — берем первый
        addSubjectLocal(filteredSubjects[0]);
        setIsOpen(false);
      }
    } else if (
      e.key === "Backspace" &&
      query === "" &&
      selectedSubjects.length > 0
    ) {
      removeSubjectLocal(selectedSubjects[selectedSubjects.length - 1]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 space-y-4" ref={containerRef}>
      <div className="relative">
        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
          {t("label_desired_subjects")}
        </label>

        <div
          className={`min-h-[64px] w-full bg-gray-100 hover:bg-blue-50 border-2 transition-all rounded-2xl p-2 flex flex-wrap gap-2 items-center ${
            isOpen ? "border-blue-400 bg-white shadow-sm" : "border-transparent"
          }`}
          onClick={() => setIsOpen(true)}
        >
          {/* Рендерим выбранные теги с переводом */}
          {selectedSubjects.map((subjectKey) => (
            <span
              key={subjectKey}
              className="flex items-center gap-1.5 bg-blue-600 text-white pl-3 pr-2 py-1.5 rounded-xl text-sm font-bold animate-in zoom-in-95 duration-200"
            >
              {getTranslation(subjectKey)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSubjectLocal(subjectKey);
                }}
                className="hover:bg-blue-500 rounded-lg p-0.5 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          ))}

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedSubjects.length === 0
                ? t("placeholder_write_or_select")
                : ""
            }
            className="flex-1 min-w-[150px] bg-transparent border-none focus:ring-0 outline-none text-blue-700 font-bold placeholder:text-blue-300 px-2"
          />
        </div>

        {isOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-blue-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              {/* Выпадающий список отфильтрованных предметов */}
              {filteredSubjects.map((subjectKey) => (
                <button
                  key={subjectKey}
                  onClick={(e) => {
                    e.stopPropagation();
                    addSubjectLocal(subjectKey);
                  }}
                  className="w-full text-left px-4 py-3 text-blue-700 hover:bg-blue-50 rounded-xl transition-colors font-semibold flex items-center justify-between group"
                >
                  {getTranslation(subjectKey)}
                </button>
              ))}

              {filteredSubjects.length === 0 && !query && isLoading && (
                <div className="px-4 py-4 text-center animate-pulse text-gray-400 text-sm">
                  {t("loading")}
                </div>
              )}

              {filteredSubjects.length === 0 && query && (
                <div className="px-4 py-4 text-center text-gray-400 text-sm">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectPicker;
