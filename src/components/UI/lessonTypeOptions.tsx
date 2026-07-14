import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

interface LessonTypePickerProps {
  selectedFormats: string[];
  addFormat: (format: string) => void;
  removeFormat: (format: string) => void;
  showAlert: (type: "success" | "error" | "info", message: string) => void;
}

const LessonTypePicker = ({
  selectedFormats,
  addFormat,
  removeFormat,
  showAlert,
}: LessonTypePickerProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom next-intl namespaces based on your setup
  const tFormats = useTranslations("lesson_formats_list");
  const tErrors = useTranslations("RegistrationModal");
  const t = useTranslations("profiles");

  // Hardcoded static format identifiers matching your system requirements
  const formats = ["offline", "online"];

  // Matches your exact custom .raw() nested object translation extraction logic
  const getTranslation = (key: string) => {
    if (!tFormats.has(key)) return key;

    try {
      const rawValue = tFormats.raw(key);

      if (rawValue && typeof rawValue === "object" && "name" in rawValue) {
        return rawValue.name;
      }

      return tFormats(key);
    } catch (e) {
      return tFormats(key);
    }
  };

  // Memoized filter processing identical to your subject architecture
  // const filteredFormats = useMemo(() => {
  //   return formats
  //     .filter((key) => !selectedFormats.includes(key))
  //     .filter((key) => {
  //       const translatedName = getTranslation(key).toLowerCase();
  //       return translatedName.includes(query.toLowerCase());
  //     });
  // }, [query, selectedFormats]);

  const addFormatLocal = (format: string) => {
    const trimmed = format.trim();
    if (trimmed && !selectedFormats.includes(trimmed)) {
      addFormat(trimmed);
    }
    setQuery("");
  };

  const removeFormatLocal = (formatToRemove: string) => {
    removeFormat(formatToRemove);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Safe guard: only match if the typed string explicitly correlates to a valid filtered item
      const exactMatch = filteredFormats.find(
        (key) =>
          getTranslation(key).toLowerCase() === query.trim().toLowerCase(),
      );
      if (exactMatch) {
        addFormatLocal(exactMatch);
        setIsOpen(false);
      }
    } else if (
      e.key === "Backspace" &&
      query === "" &&
      selectedFormats.length > 0
    ) {
      removeFormatLocal(selectedFormats[selectedFormats.length - 1]);
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
        {/* Matches your exact label styles */}
        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">
          {t("label_lesson_type") || "ТИП ОБУЧЕНИЯ"}
        </label>

        {/* Input container wrapper mirroring the custom borders and active rings */}
        <div
          className={`min-h-[64px] w-full bg-gray-100 hover:bg-blue-50 border-2 transition-all rounded-2xl p-2 flex flex-wrap gap-2 items-center ${
            isOpen ? "border-blue-400 bg-white shadow-sm" : "border-transparent"
          }`}
          onClick={() => setIsOpen(true)}
        >
          {selectedFormats?.map((format) => (
            <span
              key={format}
              className="flex items-center gap-1.5 bg-blue-600 text-white pl-3 pr-2 py-1.5 rounded-xl text-sm font-bold animate-in zoom-in-95 duration-200"
            >
              {getTranslation(format)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFormatLocal(format);
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
              selectedFormats?.length === 0
                ? t("placeholder_select_format") || "Выберите формат занятий..."
                : ""
            }
            className="flex-1 min-w-[150px] bg-transparent border-none focus:ring-0 outline-none text-blue-700 font-bold placeholder:text-blue-300 px-2"
          />
        </div>

        {isOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-blue-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              {formats.map((format) => (
                <button
                  key={format}
                  onClick={(e) => {
                    e.stopPropagation();
                    addFormatLocal(format);
                  }}
                  className="w-full text-left px-4 py-3 text-blue-700 hover:bg-blue-50 rounded-xl transition-colors font-semibold flex items-center justify-between group"
                >
                  {getTranslation(format)}
                </button>
              ))}

              {formats.length === 0 && (
                <div className="px-4 py-4 text-center text-gray-400 text-sm italic">
                  {t("all_formats_selected") || "Все форматы выбраны"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTypePicker;
