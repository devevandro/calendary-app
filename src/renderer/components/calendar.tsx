"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { isHoliday, getBrazilianHoliday } from "renderer/lib/holidays";
import { CalendarProps } from "renderer/lib/interfaces";
import { months, weekdays } from "renderer/lib/constants";
import {
  generateCalendarDays,
  hasEvents,
  isCurrentDay,
  isCurrentMonth,
  isCurrentWeekday,
  isPastDate,
} from "renderer/lib/functions";

export default function Calendar({
  currentDate,
  onDateChange,
  onSelectDate,
  events,
  minYear,
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = generateCalendarDays(year, month);

  const prevMonth = () => {
    const newDate = new Date(currentDate);

    if (month === 0) {
      if (year - 1 < minYear) {
        return;
      }
      newDate.setFullYear(year - 1);
      newDate.setMonth(11);
    } else {
      newDate.setMonth(month - 1);
    }

    onDateChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);

    if (month === 11) {
      newDate.setFullYear(year + 1);
      newDate.setMonth(0);
    } else {
      newDate.setMonth(month + 1);
    }

    onDateChange(newDate);
  };

  const handleSelectDate = (date: Date) => {
    if (isPastDate(date)) return;
    setSelectedDate(date);
    onSelectDate(date);
  };

  if (!mounted) return null;

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className={`p-2 "hover:bg-gray-700 rounded-full text-white`}
            disabled={year === minYear && month === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className={`text-xl font-semibold text-right text-white`}>
            {year}
          </div>

          <button
            onClick={nextMonth}
            className={`p-2 hover:bg-gray-700 rounded-full text-white`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-between mb-4">
          {months.map((m, i) => (
            <button
              key={m}
              onClick={() => onDateChange(new Date(year, i, 1))}
              className={`text-sm px-2 py-1 rounded
                ${i === month ? "font-bold" : "text-gray-400"}
                ${isCurrentMonth(i) ? "text-[#005385] font-bold" : ""}
              `}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day, index) => (
            <div
              key={day}
              className={`text-center font-medium text-gray-300}
                ${isCurrentWeekday(index) ? "text-[#005385] font-bold" : ""}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(
            ({ date, isCurrentMonth: isInCurrentMonth }, index) => {
              const isDisabled = isPastDate(date);
              const dateHasEvents = hasEvents(date, events);
              const dateIsHoliday = isHoliday(date);
              const holidayName = getBrazilianHoliday(date);

              return (
                <div key={index} className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSelectDate(date)}
                        disabled={isDisabled}
                        className={`
                        h-10 w-10 rounded-full flex items-center justify-center mx-auto relative group text-gray-500

                        ${isCurrentDay(date) && "bg-gray-700"}
                        ${
                          isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:ring-2 hover:ring-[#003fba]/50"
                        }
                        ${
                          selectedDate &&
                          date.getDate() === selectedDate.getDate() &&
                          date.getMonth() === selectedDate.getMonth() &&
                          date.getFullYear() === selectedDate.getFullYear()
                            ? "bg-[#003fba] text-white"
                            : ""
                        }
                        ${
                          dateHasEvents &&
                          !isCurrentDay(date) &&
                          !(
                            selectedDate &&
                            date.getDate() === selectedDate.getDate() &&
                            date.getMonth() === selectedDate.getMonth() &&
                            date.getFullYear() === selectedDate.getFullYear()
                          ) &&
                          "bg-[#003fba]/40"
                        }
                        ${
                          dateIsHoliday &&
                          isInCurrentMonth &&
                          !dateHasEvents &&
                          !isCurrentDay(date) &&
                          !(
                            selectedDate &&
                            date.getDate() === selectedDate.getDate() &&
                            date.getMonth() === selectedDate.getMonth() &&
                            date.getFullYear() === selectedDate.getFullYear()
                          ) &&
                          "bg-red-900/30"
                        }
                        hover:bg-gray-700
                      `}
                      >
                        {date.getDate()}
                        {!isDisabled && !dateHasEvents && isInCurrentMonth && (
                          <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-3 w-3 text-[#003fba]" />
                          </span>
                        )}
                        {dateIsHoliday && isInCurrentMonth && (
                          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-red-500"></span>
                        )}
                      </button>
                    </TooltipTrigger>
                    {dateIsHoliday && (
                      <TooltipContent
                        side="top"
                        align="center"
                        className={`bg-gray-800 text-white border-gray-700 p-2 text-xs font-medium shadow-md z-50`}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1 text-red-500" />
                          <span>{holidayName}</span>
                        </div>
                        {holidayName !== "Feriado Municipal" && (
                          <p className="text-xs opacity-75">Feriado Nacional</p>
                        )}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              );
            }
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
