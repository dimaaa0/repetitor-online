"use client";

import React, { useState, useEffect } from "react";

export interface TimeSlot {
  s: string;
  e: string;
}

export type WeeklyAvailability = Record<string, TimeSlot[]>;

interface PlannerProps {
  initialSchedule: WeeklyAvailability;
  editAvailability: (availability: WeeklyAvailability) => void;
}

export default function Planner({
  initialSchedule,
  editAvailability,
}: PlannerProps) {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const generateTimeSlots = (startHour = 7) => {
    const slots = [];
    for (let hour = startHour; hour <= 22; hour++) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots(7);
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    initialSchedule || {},
  );

  useEffect(() => {
    if (initialSchedule) setAvailability(initialSchedule);
  }, [initialSchedule]);

  const toggleSlot = (dayIndex: number, time: string) => {
    const dayKey = String(dayIndex);
    const currentDaySlots = availability[dayKey]
      ? [...availability[dayKey]]
      : [];

    const slotIndex = currentDaySlots.findIndex((slot) => slot.s === time);
    let updatedDaySlots;

    if (slotIndex > -1) {
      updatedDaySlots = currentDaySlots.filter((slot) => slot.s !== time);
    } else {
      const [hours] = time.split(":").map(Number);
      const endTime = `${String(hours + 1).padStart(2, "0")}:00`;
      updatedDaySlots = [...currentDaySlots, { s: time, e: endTime }];
    }

    const newAvailability = {
      ...availability,
      [dayKey]: updatedDaySlots,
    };

    setAvailability(newAvailability);
    editAvailability(newAvailability);
  };

  return (
    <div className="w-full space-y-6">
      {/* Шапка */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.1em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Свободное время
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">
            Нажмите на часы, когда вы свободны
          </span>
        </div>
      </div>

      {/* Таблица расписания */}
      <div className="w-full border-2 border-gray-100 rounded-[18px] bg-white shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto block">
          <table className="w-full border-collapse table-fixed min-w-[420px]">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="w-[50px] sm:w-[45px] py-2.5 sm:py-3 bg-slate-50 border-r-2 border-gray-100 text-center">
                  <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                    Время
                  </span>
                </th>
                {days.map((day, idx) => (
                  <th
                    key={day}
                    className={`px-0.5 py-2.5 sm:py-3 bg-slate-50 text-center sm:w-[20px] ${
                      idx !== days.length - 1 ? "border-r-2 border-gray-100" : ""
                    }`}
                  >
                    <span className="text-[10px] font-black text-gray-500 uppercase block">
                      {day}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr
                  key={time}
                  className="border-b-2 border-gray-100 last:border-b-0"
                >
                  {/* Ячейка времени */}
                  <td className="h-9 sm:h-11 bg-slate-50 border-r-2 border-gray-100 text-center">
                    <span className="text-[8px] sm:text-[10px] font-bold text-slate-400">
                      {time}
                    </span>
                  </td>
                  {/* Ячейки дней недели */}
                  {days.map((_, index) => {
                    const dayIndex = index + 1;
                    const dayKey = String(dayIndex);
                    const isSelected = availability[dayKey]?.some(
                      (slot: TimeSlot) => slot.s === time,
                    );
                    return (
                      <td
                        key={index}
                        className={`h-10 p-0 ${
                          index !== days.length - 1 ? "border-r-2 border-gray-100" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSlot(dayIndex, time)}
                          style={{
                            background: isSelected ? "#3b82f6" : "white",
                          }}
                          className="w-full h-full border-none cursor-pointer transition-colors duration-200 flex items-center justify-center hover:bg-blue-50 data-[selected=true]:hover:bg-blue-600"
                          data-selected={isSelected}
                        >
                          {isSelected && (
                            <div className="w-1 h-1 bg-white rounded-full opacity-50" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}