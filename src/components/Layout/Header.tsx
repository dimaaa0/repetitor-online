"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { User, LogOut, Menu, X, Book } from "lucide-react";
import LanguagePicker from "../UI/LanguagePicker";
import Registration from "../UI/RegistrationModal";
import { useModal } from "../../context/ModalContext";

function Header() {

  const pathname = usePathname(); // Получаем текущий путь для подсветки
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для мобильного меню

  const { openModal } = useModal();

  const navLinks = [
    { name: "Учителя", href: "/Teachers" },
    { name: "Объявления", href: "/Announcements" },
  ];

  const user =
    null
    // { name: "Dmitriy Pisarenko" }
    ;

  const isLinkActive = (href: string) => pathname === href;

  return (
    <header className=" flex items-center justify-space-between px-4 top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm ">
      <nav className="max-w-7xl w-full mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <Book
              className="w-8 h-8 text-blue-600 transition-colors group-hover:text-blue-700"
              strokeWidth={1.5}
            />
            <h1 className="text-[24px] my-2 font-semibold text-blue-600 hidden min-[501px]:block">
              Репетитор онлайн
            </h1>
          </Link>

        </div>
        <div className="mobile-nav-hidden flex transform translate-y-[3px]  items-center  gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[16px] p-2 font-medium gap-3 transition-colors ${isLinkActive(link.href)
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <Registration />


        <div className="flex items-center gap-5">
          <LanguagePicker />
          {
            !user ? (
              <button
                className="flex items-center cursor-pointer gap-2 px-3 py-1.5  text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all text-sm font-medium mobile-nav-hidden"
                onClick={openModal}
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[16px] ">Войти</span>
              </button>
            ) : (
              <>
                <Link href="/profile" className="flex items-center gap-2.5 group"
                >
                  <div className="p-1.5 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                    <User
                      className="w-5 h-5 text-gray-700 group-hover:text-blue-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className="text-[16px]  text-gray-700 group-hover:text-blue-600 transition-colors mobile-nav-hidden">
                    {user?.name || "Гость"}
                  </span>
                </Link>

                <button className="flex items-center cursor-pointer gap-2 px-3 py-1.5  text-gray-700 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-all text-sm font-medium mobile-nav-hidden">
                  <LogOut className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-[16px] ">Выйти</span>
                </button>
              </>
            )
          }




          <button
            className="p-2 md:hidden text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 bg-blue-50 rounded-full">
                <User className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              </div>
              <span className="text-base font-semibold text-gray-700">
                {user?.name || "Гость"}
              </span>
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-lg font-medium ${isLinkActive(link.href)
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button className="flex items-center gap-2 w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-lg font-medium hover:bg-red-100 transition-all mt-4">
            <LogOut className="w-6 h-6" strokeWidth={1.5} />
            <span>Выйти</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
