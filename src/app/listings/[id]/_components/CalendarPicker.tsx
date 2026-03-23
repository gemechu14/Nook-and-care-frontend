"use client";

import { useState } from "react";
import { MONTH_NAMES, DAY_NAMES } from "../_constants";

interface CalendarPickerProps {
  onSelect: (date: Date) => void;
}

export function CalendarPicker({ onSelect }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const today = new Date();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDateClick = (day: number) => {
    onSelect(new Date(currentYear, currentMonth, day));
  };

  const isToday = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const isPastDate = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    return d < today && !isToday(day);
  };

  return (
    <div className="w-full sm:w-64">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-semibold text-slate-900">
          {MONTH_NAMES[currentMonth] ?? ""} {currentYear}
        </h3>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((day) => (
          <div key={day} className="text-xs font-medium text-slate-500 text-center py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isPastDate(day);
          const todayClass = isToday(day) ? "bg-teal-600 text-white font-semibold" : "";

          return (
            <button
              key={day}
              type="button"
              onClick={() => !disabled && handleDateClick(day)}
              disabled={disabled}
              className={`aspect-square text-sm rounded hover:bg-teal-50 transition-colors ${
                disabled ? "text-slate-300 cursor-not-allowed" : todayClass || "text-slate-700 hover:text-teal-600"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
