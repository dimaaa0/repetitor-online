"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { User, LogOut, Menu, X, Book } from "lucide-react";
import LanguagePicker from "../UI/LanguagePicker";
import Registration from "../UI/RegistrationModal";
import { useModal } from "../../context/ModalContext";

function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useModal();

  const navLinks = [
    { name: "Учителя", href: "/Teachers" },
    { name: "Объявления", href: "/Announcements" },
  ];

  const user = null; // { name: "Dmitriy Pisarenko" }

  const isLinkActive = (href: string) => pathname === href;

  return (
    // Добавлен backdrop-blur и sticky позиционирование для эффекта "стекла"
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">

      <nav className="max-w-7xl w-full mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Иконка теперь имеет мягкий фон при наведении */}
            <div className="p-2  rounded-xl transition-colors">
              <Book
                className="w-7 h-7 text-blue-600 transition-transform group-hover:scale-100"
                strokeWidth={2}
              />
            </div>
            <h1 className="text-[22px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden min-[501px]:block tracking-tight">
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
              {isLinkActive(link.href) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>


        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguagePicker />
          </div>

          {!user ? (
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
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:shadow-md transition-all">
                  <User className="w-5 h-5 text-blue-600" strokeWidth={2} />
                </div>
                <span className="text-[15px] font-semibold text-slate-700 group-hover:text-blue-600 hidden lg:block">
                  {user?.name}
                </span>
              </Link>

              <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <LogOut className="w-5 h-5" strokeWidth={2} />
              </button>
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

      {/* Мобильное меню с улучшенным дизайном */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 p-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block p-3 rounded-xl text-lg font-bold ${
                  isLinkActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <LanguagePicker />
            {user && (
              <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-red-50 text-red-600 rounded-xl font-bold transition-all">
                <LogOut className="w-5 h-5" />
                <span>Выйти из системы</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
