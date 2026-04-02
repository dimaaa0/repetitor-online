import { Heart, SlidersHorizontal, User } from 'lucide-react';
import React from 'react';

// Тестовые данные (оставляем те же)
const tutors = [
    { id: 1, name: "Александр Иванов", subject: "Математика (ЕГЭ/ОГЭ)", experience: "бла бла бла", students: 8, price: "1500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", tags: ["Профи", "Терпеливый"] },
    { id: 2, name: "Мария Петрова", subject: "Английский язык", experience: "бле бле бле ", students: 5, price: "1200", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", tags: ["Native Speaker", "Дети"] },
    { id: 3, name: "Никита Соколов", subject: "Физика", experience: "блю блю блю", students: 3, price: "2000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry", tags: ["Олимпиады", "Вуз"] }
];

const TutorsPageWithAnimation = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl px-4 mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="sm:text-2xl font-bold text-[18px] text-gray-800">Наши репетиторы</h1>
                        <div className="text-sm text-gray-500">Найдено: {tutors.length}</div>
                    </div>
                    <div>
                        <button className="bg-white flex gap-2  cursor-pointer border-1 border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            Фильтры
                            <span>
                                <SlidersHorizontal width={20} />
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Увеличил gap для красоты */}
                    {tutors.map((tutor) => (
                        <div
                            key={tutor.id}
                            className="bg-white rounded-2xl border border-gray-100 p-6 
                         shadow-sm 
                         transition-all duration-300 ease-in-out
                         hover:shadow-xl hover:-translate-y-2 hover:border-blue-100"
                        >
                            <div className="flex items-start gap-4">
                                <img
                                    src={tutor.avatar}
                                    alt={tutor.name}
                                    className="w-16 h-16 rounded-full bg-blue-50 border border-gray-100"
                                />

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold hyphens-auto line-clamp-2 text-lg text-gray-900 leading-tight break-words">
                                        {tutor.name}
                                    </h3>
                                    <p className="text-blue-600 text-sm font-medium mt-1 truncate"> {/* Можно добавить truncate и сюда */}
                                        {tutor.subject}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 cursor-pointer bg-white border-blue-400 border-1 px-2 py-1 rounded-lg"
                                >
                                    <button className="text-white cursor-pointer text-xs ">
                                        <Heart strokeWidth={1.5} width={24} className='text-blue-600 text-w-1px' />
                                    </button>
                                    <span className="text-sm font-bold text-blue-400">{tutor.students}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                {tutor.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <hr className="my-5 border-gray-100" />

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    О себе - <span className="font-semibold text-gray-700">{tutor.experience}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-gray-900">{tutor.price} ₽</span>
                                    <span className="text-xs text-gray-400 block">за час</span>
                                </div>
                            </div>

                            <button className="w-full  mt-5 bg-blue-600 text-white py-3 rounded-xl font-semibold
                                 transition-colors duration-200 cursor-pointer
                                 hover:bg-blue-700 active:scale-95">
                                Узнать детали
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TutorsPageWithAnimation;

//! СДЕЛАТЬ ЕСЛИ АККАУНТА РОЛЬ РЕПЕТИТОР, ТО КАЖДЫЙ РАЗ ВЫДАВАТЬ В ПРАВОМ НИЖНЕМ УГЛУ УВЕДОМЛЕНИЕ, ЧТОБЫ ЧЕЛОВЕК НЕ ЗАБЫЛ ИЗМЕНИТЬ СВОЕ РАСПИСАНИЕ, ДЛЯ КОРРЕКТНОЙ СОРТИРОВКИ.