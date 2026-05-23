'use client';

import React, { useState } from 'react';

interface TimeSlot {
    s: string;
    e: string;
}

type WeeklyAvailability = Record<string | number, TimeSlot[]>;

interface FreeTimeBarProps {
    initialSchedule: WeeklyAvailability & { availability?: WeeklyAvailability };
}

const DAYS_MAP = [
    { id: '1', name: 'Пн' },
    { id: '2', name: 'Вт' },
    { id: '3', name: 'Ср' },
    { id: '4', name: 'Чт' },
    { id: '5', name: 'Пт' },
    { id: '6', name: 'Сб' },
    { id: '7', name: 'Вс' },
];

const FreeTimeBar = ({ initialSchedule }: FreeTimeBarProps) => {
    // Распаковываем двойную вложенность, если база вернула { availability: { 1: [...] } }
    const schedule = initialSchedule?.availability ? initialSchedule.availability : initialSchedule;

    // Безопасно получаем слоты, зная, что мы работаем с чистым объектом расписания
    const getSlotsByDayId = (id: string): TimeSlot[] => {
        if (!schedule) return [];
        return schedule[id] || schedule[Number(id)] || [];
    };

    // Находим первый рабочий день
    const firstAvailableDay = DAYS_MAP.find(day => getSlotsByDayId(day.id).length > 0)?.id || '1';

    const [selectedDay, setSelectedDay] = useState<string>(firstAvailableDay);

    // Получаем слоты и сортируем их
    const daySlots = getSlotsByDayId(selectedDay);
    const currentSlots = [...daySlots].sort((a, b) => a.s.localeCompare(b.s));

    return (
        <div className="w-full">
            <div className="bg-white rounded-3xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100">
                <h4 className="text-slate-900 font-bold text-base mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Свободное время
                </h4>

                {/* Дни недели */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                    {DAYS_MAP.map((day) => {
                        const daySlots = getSlotsByDayId(day.id);
                        const hasSlots = daySlots.length > 0;
                        const isSelected = selectedDay === day.id;

                        return (
                            <button
                                key={day.id}
                                disabled={!hasSlots}
                                onClick={() => setSelectedDay(day.id)}
                                className={`flex flex-col items-center justify-center p-2.5 min-w-[52px] rounded-2xl border text-xs font-bold transition-all snap-start cursor-pointer ${isSelected
                                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                        : hasSlots
                                            ? "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                                            : "bg-white border-slate-100 text-slate-300 opacity-40 cursor-not-allowed"
                                    }`}
                            >
                                <span>{day.name}</span>
                                {hasSlots && !isSelected && (
                                    <span className="w-1 h-1 rounded-full bg-blue-500 mt-1"></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Слоты времени */}
                <div className="mt-4">
                    {currentSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                            {currentSlots.map((slot, index) => (
                                <div
                                    key={index}
                                    title={`С ${slot.s} до ${slot.e}`}
                                    className="py-2 text-center bg-slate-50 border border-slate-100 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                                >
                                    {slot.s}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <span className="text-xs text-slate-400 font-medium italic">
                                Нет свободных слотов
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FreeTimeBar;