"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from "../../../src/utils/supabase/client";

export interface TimeSlot {
    s: string; // Start "09:00"
    e: string; // End "09:30"
}

export type WeeklyAvailability = Record<string, TimeSlot[]>;

interface PlannerProps {
    initialSchedule: WeeklyAvailability; // Начальные данные из базы
    userId: string; // ID пользователя для сохранения
    // editAvailability: void
    editAvailability: (availability: WeeklyAvailability) => void;
}

export default function Planner({ initialSchedule, userId, editAvailability }: PlannerProps) {
    const supabase = createClient();

    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const generateTimeSlots = (startHour = 7) => {
        const slots = [];
        // Начинаем с часа, который ты передашь (7, 8 или 9)
        // Заканчиваем, например, в 22:00
        for (let hour = startHour; hour <= 22; hour++) {
            slots.push(`${String(hour).padStart(2, '0')}:00`);
        }
        return slots;
    };

    // Использование:
    const timeSlots = generateTimeSlots(7); // Начнет с 07:00, 08:00, 09:00...

    // Используем состояние, инициализируя его данными из пропсов
    const [availability, setAvailability] = useState<WeeklyAvailability>(initialSchedule || {});

    // Синхронизируем состояние, если пропсы изменились
    useEffect(() => {
        if (initialSchedule) {
            setAvailability(initialSchedule);
        }
    }, [initialSchedule]);

    const toggleSlot = (dayIndex: number, time: string) => {
        const dayKey = String(dayIndex);
        const newAvailability = { ...availability };

        if (!newAvailability[dayKey]) {
            newAvailability[dayKey] = [];
        }

        const slotIndex = newAvailability[dayKey].findIndex(slot => slot.s === time);

        if (slotIndex > -1) {
            // Удаляем (снимаем выделение)
            newAvailability[dayKey] = newAvailability[dayKey].filter(slot => slot.s !== time);
        } else {
            // Рассчитываем время конца (+1 час)
            const [hours] = time.split(':').map(Number);
            const endHours = hours + 1;
            // Форматируем в строку, например из "07" получаем "08:00"
            const endTime = `${String(endHours).padStart(2, '0')}:00`;

            newAvailability[dayKey] = [
                ...newAvailability[dayKey],
                { s: time, e: endTime }
            ];
        }

        setAvailability(newAvailability);
    };

    useEffect(() => {
        editAvailability(availability)
    }, [availability])


    return (
        <div className="space-y-6">
            {/* Заголовок в стиле основного блока "Ваше объявление" */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    График занятий
                </h2>

                {/* Бейдж-подсказка */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">
                        Нажмите на часы, когда вы свободны
                    </span>
                </div>
            </div>

            {/* Контейнер таблицы */}
            <div className="w-full overflow-hidden border-2 border-gray-100 rounded-[28px] bg-white shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[750px] grid grid-cols-8 divide-x-2 divide-gray-50">

                        {/* Колонка времени */}
                        <div className="flex flex-col bg-gray-50/50">
                            <div className="h-12 border-b-2 border-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Время
                            </div>
                            {timeSlots.map((time) => (
                                <div
                                    key={time}
                                    className="h-14 flex items-center justify-center text-[12px] font-bold text-gray-400 border-b-2 border-gray-50 last:border-0"
                                >
                                    {time}
                                </div>
                            ))}
                        </div>

                        {/* Колонки дней недели */}
                        {days.map((dayName, index) => {
                            const dayKey = String(index + 1);
                            return (
                                <div key={dayName} className="flex flex-col">
                                    <div className="h-12 border-b-2 border-gray-50 bg-gray-50/50 flex items-center justify-center">
                                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-tight">
                                            {dayName}
                                        </span>
                                    </div>

                                    {timeSlots.map((time) => {
                                        const isSelected = availability[dayKey]?.some((slot: any) => slot.s === time);

                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => toggleSlot(index + 1, time)}
                                                className={`
                      h-14 border-b-2 border-gray-50 last:border-0 transition-all duration-200 relative group
                      ${isSelected
                                                        ? 'bg-blue-500 hover:bg-blue-600'
                                                        : 'hover:bg-blue-50/50 bg-white'}
                    `}
                                            >
                                                {/* Индикатор выбора */}
                                                {isSelected ? (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-1 h-1 bg-white rounded-full opacity-50 shadow-[0_0_8px_white]"></div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <div className="w-2 h-2 border-2 border-blue-200 rounded-full"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx global>{`
    .custom-scrollbar::-webkit-scrollbar {
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f8fafc;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #e2e8f0;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #cbd5e1;
    }
  `}</style>
        </div>
    );
}