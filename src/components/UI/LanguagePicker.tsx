"use client";

import { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown } from "lucide-react";

const languages = [
  { value: "RU", name: "Русский", flag: "🇷🇺" },
  { value: "EN", name: "English", flag: "🇺🇸" },
  { value: "UZ", name: "O'zbek", flag: "🇺🇿" },
];

function LanguagePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне элемента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
      >
        <Languages
          size={18}
          className="text-gray-500 group-hover:text-blue-600"
          strokeWidth={1.5}
        />
        <span className="text-sm font-medium text-gray-700">
          {currentLang.value}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-150">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                setCurrentLang(lang);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                currentLang.value === lang.value
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>
                {lang.flag} {lang.name}
              </span>
              {currentLang.value === lang.value && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguagePicker;
