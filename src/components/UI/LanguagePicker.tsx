"use client";

import { useRef, useEffect, useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
// Импортируем хуки для работы с интернационализированными роутами
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

const languages = [
  { value: "ru", name: "Русский", flag: "🇷🇺" }, // Изменили значения на маленькие буквы, чтобы совпадали с URL
  { value: "en", name: "English", flag: "🇺🇸" },
  { value: "uz", name: "O'zbek", flag: "🇺🇿" },
];

function LanguagePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();     // Хук для смены URL
  const pathname = usePathname(); // Получает текущий путь БЕЗ языкового префикса (например, '/profile')
  const locale = useLocale();     // Получает текущую локаль ('ru', 'uz' или 'en')

  // Находим объект текущего языка на основе локали из URL
  const currentLang = languages.find((lang) => lang.value === locale) || languages[0];

  // Функция переключения языка через роутер
  const handleLanguageChange = (nextLocale: string) => {
    if (nextLocale === locale) {
      setIsOpen(false);
      return;
    }

    // 1. Если мы на главной странице (путь "/" или пустой)
    if (!pathname || pathname === "/" || pathname === `/${locale}`) {
      router.replace(`/${nextLocale}`);
      setIsOpen(false);
      return;
    }

    // 2. Если мы на внутренних страницах (например, /ru/teachers)
    const segments = pathname.split("/");

    // Проверяем, действительно ли второй сегмент — это текущая локаль
    if (segments[1] === locale) {
      segments[1] = nextLocale;
    } else {
      // Если языка в пути почему-то не было (редкий случай), добавляем его в начало
      segments.splice(1, 0, nextLocale);
    }

    const newPath = segments.join("/");
    router.replace(newPath);
    setIsOpen(false);
  };

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
        className="flex items-center cursor-pointer gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
      >
        <Languages
          size={18}
          className="text-gray-500 group-hover:text-blue-600"
          strokeWidth={1.5}
        />
        <span className="text-sm font-medium text-gray-700 uppercase">
          {currentLang.value}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in duration-150">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => handleLanguageChange(lang.value)} // Вызываем нашу функцию смены роута
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${currentLang.value === lang.value
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