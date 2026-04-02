import { describe } from 'node:test';
import React from 'react';

const ads = [
  {
    id: 1,
    studentName: "Артем, 11 класс",
    title: "Ищу репетитора по профильной математике",
    description: "Нужна помощь в подготовке к ЕГЭ. Западают задачи с параметрами и геометрия.",
    budget: "до 1500 ₽",
    subject: "Математика",
    postedAt: "2 часа назад"
  },
  {
    id: 2,
    studentName: "Елена",
    title: "Разговорный английский для переезда",
    description: "Уровень сейчас Intermediate. Нужно подтянуть говорение и убрать страх общения.",
    budget: "1000 - 1200 ₽",
    subject: "Английский",
    postedAt: "Сегодня"
  }
];

const goalTags = [
  {
    title: "ЕГЭ / ОГЭ",
    description: "Подготовка к государственным экзаменам: разбор ловушек, критериев оценивания и заполнения бланков."
  },
  {
    title: "Сертификат",
    description: "Подготовка к финальному экзамену по данной сфере."
  },
  {
    title: "SAT",
    description: "Подготовка к SAT"
  },
  {
    title: "ДТМ",
    description: "Специализированная подготовка к тестированию Государственного центра тестирования (Узбекистан)."
  },
  {
    title: "Начальные классы",
    description: "Помощь ученикам младших классов."
  },
  {
    title: "Школьная программа",
    description: "Устранение пробелов в знаниях, повышение успеваемости и помощь с домашними заданиями."
  },
  {
    title: "Олимпиады",
    description: "Разбор задач повышенной сложности и подготовка к интеллектуальным соревнованиям."
  },
  {
    title: "Поступление в лицеи",
    description: "Подготовка к внутренним экзаменам в топовые гимназии, лицеи и специализированные школы."
  },
  {
    title: "Вузовская программа",
    description: "Помощь студентам: подготовка к зачетам, сессиям и разбор сложных тем высшей школы."
  },
  {
    title: "Релокация",
    description: "Быстрое освоение базы, необходимой для адаптации и жизни в другой стране."
  }
];

const AnnouncementsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Объявления учеников</h1>
            <p className='text-sm text-gray-500'>Найдено: {ads.length}</p>
          </div>
          <button className="bg-white border  border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Фильтры
          </button>
        </div>

        {/* Список объявлений */}
        <div className="flex flex-col gap-5">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white cursor-default rounded-2xl border border-gray-100 p-6 
                         shadow-sm transition-all duration-300 
                         hover:shadow-md hover:border-blue-200 group
                         shadow-sm 
                         transition-all duration-300 ease-in-out
                         hover:shadow-xl hover:-translate-y-2 hover:border-blue-100
                         "
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {ad.title}
                    </h3>
                    <p className="text-sm text-gray-500">{ad.studentName} • {ad.postedAt}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {ad.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Предмет</span>
                    <span className="text-sm font-medium text-gray-700">{ad.subject}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Бюджет</span>
                    <span className="text-sm font-bold text-blue-600">{ad.budget}</span>
                  </div>
                </div>

                <button className="bg-gray-900 cursor-pointer text-white px-6 py-2 rounded-xl text-sm font-semibold 
                                   hover:bg-blue-600 transition-all active:scale-95">
                  Связаться
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;