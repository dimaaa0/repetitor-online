"use client";

import { UserPlus, Calendar, Search, BookOpen } from "lucide-react";
import Registration from "../UI/RegistrationModal";
import { useModal } from "../../context/ModalContext";

export default function HomePage() {
  const { openModal } = useModal();

  const user = 
  null;
  // { name: "Dmitriy Pisarenko" }
  ;

  return (
    <div className="font-sans overflow-hidden">
      {/* Hero Section с "живым" фоном */}
      <section className="relative py-24 px-4 text-center bg-white overflow-hidden">
        {/* Декоративные анимированные круги на фоне */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse [animation-delay:2s]" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Найдите идеального <span className="text-blue-600">репетитора</span>{" "}
            для вас
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 mb-10 leading-relaxed">
            Платформа для поиска репетиторов и учеников во всем Узбекистане.
            Удобный подбор по расписанию и предметам.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="px-8 py-4 w-[250px] bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700  shadow-lg shadow-blue-200"
            >
              Найти учителя
            </a>
            <a
              href="#"
              className="px-4 py-4 border-2 w-[250px] border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all"
            >
              Смотреть объявления
            </a>
          </div>
        </div>
      </section>

      {!user && (
        <>
          {/* Секция "Как это работает" с градиентом */}
          <section className="py-24 px-4 bg-gradient-to-b from-blue-50/50 to-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Как это работает
                </h2>
                <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                  {
                    icon: UserPlus,
                    title: "Зарегистрируйтесь",
                    desc: "Создайте профиль ученика или учителя",
                  },
                  {
                    icon: Calendar,
                    title: "Укажите расписание",
                    desc: "Добавьте ваше свободное время",
                  },
                  {
                    icon: Search,
                    title: "Найдите совпадения",
                    desc: "Система подберет учителей или учеников по графику",
                  },
                  {
                    icon: BookOpen,
                    title: "Начните обучение",
                    desc: "Свяжитесь и начните заниматься уже сейчас",
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center group p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-blue-100 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 transition-transform group-hover:rotate-6">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Секция с фоновым паттерном */}
          <section className="relative py-28 px-4 text-center overflow-hidden">
            <div
              className="absolute inset-0 -z-10 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-slate-900">
                Готовы начать путь к знаниям?
              </h2>
              <p className="text-gray-600 mb-10 text-lg">
                Присоединяйтесь к сообществу профессионалов и целеустремленных
                учеников. Ваш идеальный репетитор всего в одном клике.
              </p>
              <button
                className="inline-block px-12 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 cursor-pointer transition-all shadow-2xl hover:shadow-blue-200 active:scale-95"
                onClick={openModal}
              >
                Войти в аккаунт
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
