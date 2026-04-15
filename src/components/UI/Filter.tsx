import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '../../../src/utils/supabase/client';
import { useTutorAnnouncement } from '../../../src/context/TeacherAnnouncementContext';

const supabase = createClient();


interface FilterState {
    filters: {
        subject: string;
        maxPrice: number;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        subject: string;
        maxPrice: number;
    }>>;
    onClose?: () => void;
}

const FilterPanel = ({ filters, setFilters, onClose }: FilterState) => {
    const { announcements } = useTutorAnnouncement();
    console.log(announcements);
    

    const [subjects, setSubjects] = useState<string[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            const { data, error } = await supabase.from("subjects").select("subject");
            if (error) {
                console.error("Ошибка загрузки предметов:", error);
            } else {
                const subjectNames = data.map((item) => item.subject);
                setSubjects(subjectNames);
            }
        };

        fetchSubjects();
    }, []);

    // Обработка клика вне фильтра
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);


    const updateFilter = (key: keyof FilterState['filters'], value: string | number) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (

        <div ref={filterRef} className="bg-white absolute right-4 top-14 z-10 p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm w-[calc(100vw-2rem)] sm:w-72 max-w-sm">
            <h3 className="text-base sm:text-lg font-bold mb-4">Фильтры</h3>

            {/* Поиск предмета (Текст + Выбор) */}
            <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Предмет</label>
                <input
                    list="subjects-list"
                    type="text"
                    placeholder="Поиск или ввод..."
                    className="w-full p-2 sm:p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    value={filters.subject}
                    onChange={(e) => updateFilter('subject', e.target.value)}
                />
                <datalist id="subjects-list" className="text-red">
                    {subjects.map((sub) => (
                        <option key={sub} value={sub} />
                    ))}
                </datalist>
            </div>

            {/* Цена до... */}
            <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex justify-between">
                    <span>Цена за час:</span> <span className="font-bold text-blue-600">{filters.maxPrice.toLocaleString()} UZS</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                />
                <div className="flex justify-between text-[8px] sm:text-[10px] text-gray-400 mt-1">
                    <span>0</span>
                    <span>500 000</span>
                </div>
            </div>

            <button
                className="w-full mb-2 cursor-pointer py-2 sm:py-2.5 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-blue-700 transition-all active:scale-95"
            >
                Применить
            </button>

            <button
                className="w-full py-2 sm:py-2.5 cursor-pointer text-xs sm:text-sm font-medium text-red-500 bg-red-50 rounded-xl transition-all active:scale-95 border border-transparent border-red-100 transition-all hover:bg-red-100"
                onClick={() => setFilters({ subject: '', maxPrice: 500000 })}
            >
                Сбросить все
            </button>
        </div>
    );
};

export default FilterPanel;