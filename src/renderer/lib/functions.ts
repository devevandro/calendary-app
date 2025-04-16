import { getBrazilianHoliday } from "../lib/holidays";
import { CurrentMonthHolidaysType, FilteredEventsType } from "./types";

const today = new Date();

export const getCurrentMonthHolidays = (
  currentDate: Date
): CurrentMonthHolidaysType => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const holidays: { date: number; name: string }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const holidayName = getBrazilianHoliday(date);

    if (holidayName) {
      holidays.push({ date: day, name: holidayName });
    }
  }

  return holidays;
};

export const getFilteredEvents = (
  date: Date,
  events: FilteredEventsType
): FilteredEventsType => {
  return events.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
  );
};

export const getEventIndices = (
  date: Date,
  events: FilteredEventsType
): number[] => {
  return events
    .map((event, index) => {
      if (
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      ) {
        return index;
      }
      return -1;
    })
    .filter((index) => index !== -1);
};

export const hasEvents = (date: Date, events: FilteredEventsType): boolean => {
  return events.some(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
  );
};

export const generateCalendarDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const firstDayOfWeek = firstDayOfMonth.getDay();

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => {
    const day = prevMonthLastDay - firstDayOfWeek + i + 1;
    return {
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
      isPrevMonth: true,
    };
  });

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    return {
      date: new Date(year, month, i + 1),
      isCurrentMonth: true,
      isPrevMonth: false,
    };
  });

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

export const isCurrentDay = (date: Date): boolean => {
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isCurrentWeekday = (weekdayIndex: number) => {
  return today.getDay() === weekdayIndex;
};

export const isCurrentMonth = (monthIndex: number) => {
  return today.getMonth() === monthIndex;
};

export const validateTimeFormat = (value: string): boolean => {
  if (!value) return true;

  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(value);
};
