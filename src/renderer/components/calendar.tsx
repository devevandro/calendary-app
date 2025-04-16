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

interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  events: { date: Date; title: string; description?: string; time?: string }[];
  minYear: number;
}

export default function Calendar({
  currentDate,
  onDateChange,
  onSelectDate,
  events,
  minYear,
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Montar o componente apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Meses em português
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  // Dias da semana em português
  const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Verificar se o mês atual é o mês atual do calendário
  const today = new Date();
  const isCurrentDay = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Verificar se uma data tem eventos
  const hasEvents = (date: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Gerar dias do calendário
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
      const day = prevMonthLastDay - firstDayOfWeek + i + 1;
      return {
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        isPrevMonth: true,
      };
    });

    // Dias do mês atual
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
      return {
        date: new Date(year, month, i + 1),
        isCurrentMonth: true,
        isPrevMonth: false,
      };
    });

    // Dias do próximo mês
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => {
      return {
        date: new Date(year, month + 1, i + 1),
        isCurrentMonth: false,
        isPrevMonth: false,
      };
    });

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDays = generateCalendarDays();

  // Navegar para o mês anterior
  const prevMonth = () => {
    const newDate = new Date(currentDate);

    // Se estamos em janeiro, voltar para dezembro do ano anterior
    if (month === 0) {
      // Verificar se o ano anterior é menor que o ano mínimo
      if (year - 1 < minYear) {
        return; // Não permitir voltar para anos anteriores ao mínimo
      }
      newDate.setFullYear(year - 1);
      newDate.setMonth(11);
    } else {
      newDate.setMonth(month - 1);
    }

    onDateChange(newDate);
  };

  // Navegar para o próximo mês
  const nextMonth = () => {
    const newDate = new Date(currentDate);

    // Se estamos em dezembro, avançar para janeiro do próximo ano
    if (month === 11) {
      newDate.setFullYear(year + 1);
      newDate.setMonth(0);
    } else {
      newDate.setMonth(month + 1);
    }

    onDateChange(newDate);
  };

  // Adicionar esta função para verificar se uma data é anterior ao dia atual
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Selecionar uma data
  const handleSelectDate = (date: Date) => {
    if (isPastDate(date)) return;
    setSelectedDate(date);
    onSelectDate(date);
  };

  // Verificar se é o dia da semana atual
  const isCurrentWeekday = (weekdayIndex: number) => {
    return today.getDay() === weekdayIndex;
  };

  // Verificar se é o mês atual
  const isCurrentMonth = (monthIndex: number) => {
    return today.getMonth() === monthIndex;
  };

  if (!mounted) return null;

  const isDarkMode = true;

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className={`p-2 ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } rounded-full ${isDarkMode ? "text-white" : "text-black"}`}
            disabled={year === minYear && month === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            className={`text-xl font-semibold text-right ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {year}
          </div>

          <button
            onClick={nextMonth}
            className={`p-2 ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } rounded-full ${isDarkMode ? "text-white" : "text-black"}`}
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
                ${
                  i === month
                    ? "font-bold"
                    : isDarkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }
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
              className={`text-center font-medium
                ${isDarkMode ? "text-gray-300" : "text-gray-600"}
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
              const dateHasEvents = hasEvents(date);
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
                        h-10 w-10 rounded-full flex items-center justify-center mx-auto relative group
                        ${
                          isInCurrentMonth
                            ? isDarkMode
                              ? "text-white"
                              : "text-gray-800"
                            : isDarkMode
                            ? "text-gray-500"
                            : "text-gray-400"
                        }
                        ${
                          isCurrentDay(date)
                            ? isDarkMode
                              ? "bg-gray-700"
                              : "bg-gray-200"
                            : ""
                        }
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
                          )
                            ? isDarkMode
                              ? "bg-[#003fba]/40"
                              : "bg-[#003fba]/20"
                            : ""
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
                          )
                            ? isDarkMode
                              ? "bg-red-900/30"
                              : "bg-red-100"
                            : ""
                        }
                        ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }
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
                        className={`${
                          isDarkMode
                            ? "bg-gray-800 text-white border-gray-700"
                            : "bg-white text-gray-900 border-gray-200"
                        } p-2 text-xs font-medium shadow-md z-50`}
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
