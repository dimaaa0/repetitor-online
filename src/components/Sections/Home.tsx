'use client'

import { UserPlus, Calendar, Search, BookOpen } from "lucide-react";
import Registration from "../UI/RegistrationModal"
import { useModal } from "../../context/ModalContext";

export default function HomePage() {

  const { openModal } = useModal();

  const user =
    null
  // { name: "Dmitriy Pisarenko" };
  // Пример пользователя, замените на реальную логику авторизации!!!!!!!!

  return (
    <div className="font-sans">
      <section className="py-20 px-4 text-center bg-white">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Найдите идеального репетитора для вас
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-10 leading-relaxed">
          Платформа для поиска репетиторов и учеников во всем Узбекистане.
          Удобный подбор по расписанию и предметам.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="px-2 py-3 w-[200px] bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Найти учителя
          </a>
          <a
            href="#"
            className="px-2 py-3 w-[200px] border-1 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
          >
            Смотреть объявления
          </a>
        </div>
      </section>
      {!user && (
        <>
          <section className="py-24 px-4 bg-blue-50/100">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
                Как это работает
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <UserPlus className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Зарегистрируйтесь</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Создайте профиль ученика или учителя
                  </p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Укажите расписание</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Добавьте ваше свободное время
                  </p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Найдите совпадения</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Система подберет учителей или учеников по вашему графику
                  </p>
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Начните обучение</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Свяжитесь и начните заниматься уже сейчас
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Присоединяйтесь к нашей платформе и найдите идеального учителя или
              учеников уже сегодня
            </p>
            <a
              className="inline-block px-10 py-4 bg-blue-600 cursor-pointer text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
              onClick={openModal} //* открытие панели регистрации
            >
              Войти в аккаунт
            </a>
          </section>
        </>
      )}
    </div>
  );
}

//! НЕ ЗАБЫТЬ ПРО !user НАСТРОЙКУ С 35 ПО 100 СТРОЧКУ КОДА