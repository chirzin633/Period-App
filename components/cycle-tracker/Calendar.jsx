"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, getDay, getDaysInMonth, addMonths, subMonths, isSameDay, isToday, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import useCycleStore from "@/store/cycleStore";

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({ onDayClick }) {
  const { calendarDays, currentMonth, setCurrentMonth, selectedDate, setSelectedDate } = useCycleStore();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getDay(startOfMonth(currentMonth));

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayClick = (day) => {
    setSelectedDate(day.date);
    onDayClick?.(day);
  };

  // Build grid: empty cells + days
  const emptyCells = Array(firstDay).fill(null);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-alice-blue-100">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cerulean-50 to-alice-blue-50 border-b border-alice-blue-100">
        <button onClick={handlePrev} className="w-9 h-9 rounded-xl hover:bg-cerulean-100 flex items-center justify-center text-cerulean-600 transition-colors">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className="text-lg font-semibold text-cerulean-800">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={handleNext} className="w-9 h-9 rounded-xl hover:bg-cerulean-100 flex items-center justify-center text-cerulean-600 transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 px-3 pt-3">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-alice-blue-500 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 p-3">
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
          const dayData = calendarDays.find((d) => d.date.getDate() === dayNum && d.date.getMonth() === month);
          const date = new Date(year, month, dayNum);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const today = isToday(date);

          return <CalendarDay key={dayNum} dayNum={dayNum} dayData={dayData} isSelected={isSelected} isToday={today} onClick={() => handleDayClick({ date, ...(dayData || {}) })} />;
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 px-4 py-3 border-t border-alice-blue-100 bg-alice-blue-50">
        <LegendItem color="bg-powder-petal-500" label="Period" />
        <LegendItem color="bg-gradient-to-b from-pacific-cyan-500 to-cerulean-500" label="Fertile" />
        <LegendItem color="bg-pacific-cyan-500" label="Ovulation" />
        <LegendItem color="bg-cerulean-500" label="Today" />
      </div>
    </div>
  );
}

function CalendarDay({ dayNum, dayData, isSelected, isToday, onClick }) {
  const { isPeriod, isFertile, isOvulation, isPredicted } = dayData || {};

  return (
    <button
      onClick={onClick}
      className={cn(
        "aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-200 relative",
        "hover:scale-105 hover:z-10",
        isSelected && "ring-2 ring-cerulean-500 ring-offset-1 scale-105 z-10",
        isPeriod && !isPredicted && "bg-powder-petal-500 text-white font-medium",
        isPeriod && isPredicted && "bg-powder-petal-200 text-powder-petal-800 font-medium border-2 border-dashed border-powder-petal-400",
        isOvulation && "bg-pacific-cyan-500 text-white font-bold",
        isFertile && !isOvulation && "bg-gradient-to-b from-pacific-cyan-400 to-cerulean-400 text-white",
        isToday && !isPeriod && !isFertile && !isOvulation && "bg-cerulean-500 text-white font-bold shadow-md",
        !isPeriod && !isFertile && !isOvulation && !isToday && "text-cerulean-800 hover:bg-cerulean-50",
      )}
    >
      <span className="font-medium leading-none">{dayNum}</span>
      {isPredicted && <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-powder-petal-400" />}
    </button>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-alice-blue-600">
      <div className={cn("w-3.5 h-3.5 rounded-full flex-shrink-0", color)} />
      <span>{label}</span>
    </div>
  );
}
