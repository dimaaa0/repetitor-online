"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { User, LogOut, Menu, X, Book } from "lucide-react";
import LanguagePicker from "../UI/LanguagePicker";
import Registration from "../UI/RegistrationModal";
import { useModal } from "../../context/ModalContext";
import { useUser } from "../../context/UserContext";
import { createClient } from "../../utils/supabase/client";
import link from "next/link";

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useModal();

  // 2. Достаем юзера и состояние загрузки из контекста
  const { user, loading } = useUser();
  const supabase = createClient();

  const navLinks = [
    { name: "Учителя", href: "/teachers" },
    { name: "Объявления", href: "/announcements" },
  ];

  // 3. Функция для выхода из системы
  const avatarUrl = user?.avatar_url;

  const isLinkActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl w-full mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl transition-colors">
              <Book
                className="w-7 h-7 text-blue-600 transition-transform group-hover:scale-100"
                strokeWidth={2}
              />
            </div>
            <h1 className="text-[22px] font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden min-[501px]:block tracking-tight">
              Репетитор онлайн
            </h1>
          </Link>
        </div>

        <Registration />

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-[15px] font-semibold transition-all duration-300 rounded-lg ${
                isLinkActive(link.href)
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguagePicker />
          </div>

          {/* 4. Динамическое отображение: если грузится — пусто, если нет юзера — Войти, если есть — Ник */}
          {loading ? (
            <div className="w-24 h-10 bg-gray-100 animate-pulse rounded-xl" />
          ) : !user ? (
            <button
              className="flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-95 text-sm font-bold"
              onClick={openModal}
            >
              <User className="w-4 h-4" strokeWidth={2.5} />
              <span>Войти</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all group"
              >
                {avatarUrl ? (
                  <div className="w-9 h-9 rounded-2xl overflow-hidden bg-transparent">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover bg-transparent"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <span className="text-white text-xl font-bold">
                      {user.name ? user.name[0].toUpperCase() : "?"}
                    </span>
                  </div>
                )}
                <span className="text-[15px] font-semibold max-w-[140px] truncate text-slate-700 group-hover:text-blue-600 hidden lg:block">
                  {user.name || user.email?.split("@")[0]}
                </span>
              </Link>
            </div>
          )}

          <button
            className="p-2 md:hidden text-slate-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 p-6 space-y-4 shadow-xl">
          {/* ... контент мобильного меню ... */}
          {user && (
            <>
              <div className=" flex flex-col items-center gap-4">
                {navLinks.map((link) => (
                  <Link
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-center gap-2 w-full py-3.5 bg-red-50 text-blue-600 rounded-xl font-bold transition-all duration-300 rounded-lg ${
                      isLinkActive(link.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
