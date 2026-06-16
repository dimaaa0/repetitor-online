import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSubject } from "../../context/StudentSubjectContext";
import { useUser } from "../../context/UserContext";
import { createClient } from "../../utils/supabase/client";
import { useTranslations } from "next-intl";

const SubjectPicker = ({
  showAlert,
}: {
  showAlert: (type: "success" | "error" | "info", message: string) => void;
}) => {
  const { selectedSubjects, addSubject, removeSubject } = useSubject();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tSubjects = useTranslations("subjects_list");

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

  const supabase = createClient();
  const tErrors = useTranslations("RegistrationModal");
  const t = useTranslations("profiles");
  const { user, loading, refreshUser } = useUser();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true); // Начали загрузку
      const { data, error } = await supabase.from("subjects").select("subject");
      if (error) {
        console.error("Ошибка загрузки предметов:", error);
      } else {
        const subjectNames = data.map((item) => item.subject);
        setSubjects(subjectNames);
      }
      setIsLoading(false);
    };

    fetchSubjects();
  }, []);

  const filteredSubjects = useMemo(() => {
    return subjects
      .filter((key) => !selectedSubjects.includes(key))
      .filter((key) => {
        const translatedName = getTranslation(key).toLowerCase();
        return translatedName.includes(query.toLowerCase());
      });
  }, [subjects, query, selectedSubjects]);

  const subjectLengthChecker = (subject: string) => {
    if (subject.length >= 20) {
      showAlert("error", tErrors("errors.subjectNameTooLong"));
      return true;
    }
    return false;
  };

  const addSubjectLocal = (subject: string) => {
    const trimmed = subject.trim();
    if (subjectLengthChecker(trimmed)) return;
    if (trimmed && !selectedSubjects.includes(trimmed)) {
      addSubject(trimmed);
    }
    setQuery("");
  };

  const removeSubjectLocal = (subjectToRemove: string) => {
    removeSubject(subjectToRemove);
  };

  // Обработка нажатия клавиш
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Чтобы форма не отправилась случайно
      if (query.trim() !== "") {
        addSubjectLocal(query);
        setIsOpen(false);
      }
    } else if (
      e.key === "Backspace" &&
      query === "" &&
      selectedSubjects.length > 0
    ) {
      // Удаление последнего тега при пустом инпуте через Backspace
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
          {selectedSubjects.map((subject) => (
            <span
              key={subject}
              className="flex items-center gap-1.5 bg-blue-600 text-white pl-3 pr-2 py-1.5 rounded-xl text-sm font-bold animate-in zoom-in-95 duration-200"
            >
              {getTranslation(subject)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSubjectLocal(subject);
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
            className="flex-1   min-w-[150px] bg-transparent border-none focus:ring-0 outline-none text-blue-700 font-bold placeholder:text-blue-300 px-2"
          />
        </div>

        {isOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-blue-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              {/* Если пользователь что-то ввел, чего нет в списке, показываем подсказку */}
              {query && !subjects.includes(query) && (
                <button
                  onClick={() => {
                    addSubjectLocal(query);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors font-bold flex items-center gap-2"
                >
                  <span className="text-lg">+</span> {t("btn_add")} "{query}"
                </button>
              )}

              {filteredSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={(e) => {
                    e.stopPropagation();
                    addSubjectLocal(subject);
                  }}
                  className="w-full text-left px-4 py-3 text-blue-700 hover:bg-blue-50 rounded-xl transition-colors font-semibold flex items-center justify-between group"
                >
                  {getTranslation(subject)}
                </button>
              ))}

              {filteredSubjects.length === 0 && !query && (
                <div className="px-4 py-4 text-center animate-pulse text-gray-400 text-sm">
                  {t("loading")}
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
