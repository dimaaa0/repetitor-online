"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../../src/utils/supabase/client";

export interface TimeSlot {
  s: string;
  e: string;
}

export type WeeklyAvailability = Record<string, TimeSlot[]>;

interface PlannerProps {
  initialSchedule: WeeklyAvailability;
  userId: string;
  editAvailability: (availability: WeeklyAvailability) => void;
}

export default function Planner({
  initialSchedule,
  userId,
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

  useEffect(() => {
    editAvailability(availability);
  }, [availability]);

  const toggleSlot = (dayIndex: number, time: string) => {
    const dayKey = String(dayIndex);
    const newAvailability = { ...availability };
    if (!newAvailability[dayKey]) newAvailability[dayKey] = [];

    const slotIndex = newAvailability[dayKey].findIndex(
      (slot) => slot.s === time,
    );
    if (slotIndex > -1) {
      newAvailability[dayKey] = newAvailability[dayKey].filter(
        (slot) => slot.s !== time,
      );
    } else {
      const [hours] = time.split(":").map(Number);
      const endTime = `${String(hours + 1).padStart(2, "0")}:00`;
      newAvailability[dayKey] = [
        ...newAvailability[dayKey],
        { s: time, e: endTime },
      ];
    }
    setAvailability(newAvailability);
  };

  return (
    <div className="space-y-6">
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

      <div className="w-full overflow-hidden border-2 border-gray-100 rounded-[28px] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table
            style={{
              minWidth: "750px",
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "80px",
                    padding: "12px 8px",
                    borderBottom: "2px solid #f1f5f9",
                    background: "#f8fafc",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 900,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Время
                  </span>
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    style={{
                      padding: "12px 8px",
                      borderBottom: "2px solid #f1f5f9",
                      borderLeft: "2px solid #f1f5f9",
                      background: "#f8fafc",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 900,
                        color: "#6b7280",
                        textTransform: "uppercase",
                      }}
                    >
                      {day}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td
                    style={{
                      padding: "0 8px",
                      height: "56px",
                      borderBottom: "2px solid #f1f5f9",
                      background: "#f8fafc",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#94a3b8",
                      }}
                    >
                      {time}
                    </span>
                  </td>
                  {days.map((_, index) => {
                    const dayKey = String(index + 1);
                    const isSelected = availability[dayKey]?.some(
                      (slot: any) => slot.s === time,
                    );
                    return (
                      <td
                        key={index}
                        style={{
                          height: "56px",
                          borderBottom: "2px solid #f1f5f9",
                          borderLeft: "2px solid #f1f5f9",
                          padding: 0,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSlot(index + 1, time)}
                          style={{
                            width: "100%",
                            height: "100%",
                            background: isSelected ? "#3b82f6" : "white",
                            border: "none",
                            cursor: "pointer",
                            transition: "background 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected)
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "#eff6ff";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected)
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.background = "white";
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                width: "4px",
                                height: "4px",
                                background: "white",
                                borderRadius: "50%",
                                opacity: 0.5,
                              }}
                            />
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
