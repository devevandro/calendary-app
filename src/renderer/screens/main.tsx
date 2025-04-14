"use client";

import { useState, useEffect } from "react";
import Calendar from "../components/calendar";
import EventForm from "../components/event-form";
import EventList from "../components/event-list";
import EventsModal from "../components/events-modal";
import { CalendarIcon } from "lucide-react";
import { getBrazilianHoliday } from "../lib/holidays";
import ThemeToggle from "renderer/components/theme-toggle";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<
    { date: Date; title: string; description?: string; time?: string }[]
  >([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<{
    index: number;
    event: { date: Date; title: string; description?: string; time?: string };
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Versão da aplicação
  const appVersion = "v1.0.0";

  // Montar o componente apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Obter a data atual para comparações
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Verificar se o mês/ano atual é anterior ao mês/ano atual
  const isPastMonth =
    currentDate.getFullYear() < currentYear ||
    (currentDate.getFullYear() === currentYear &&
      currentDate.getMonth() < currentMonth);

  // Obter feriados do mês atual
  const getCurrentMonthHolidays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const holidays: { date: number; name: string }[] = [];

    // Verificar cada dia do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const holidayName = getBrazilianHoliday(date);

      if (holidayName) {
        holidays.push({ date: day, name: holidayName });
      }
    }

    return holidays;
  };

  const currentMonthHolidays = getCurrentMonthHolidays();

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  // Filtrar eventos para a data selecionada
  const getFilteredEvents = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Encontrar os índices originais dos eventos filtrados
  const getEventIndices = (date: Date) => {
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

  const handleDateSelect = (date: Date) => {
    // Não permitir selecionar datas passadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    setSelectedDate(date);

    // Verificar se já existem eventos para esta data
    const dateEvents = getFilteredEvents(date);

    if (dateEvents.length > 0) {
      // Se já existem eventos, mostrar o modal
      setShowEventsModal(true);
    } else {
      // Se não existem eventos, abrir diretamente o formulário de criação
      setShowEventForm(true);
    }
  };

  const handleAddEvent = (event: {
    title: string;
    description?: string;
    time?: string;
  }) => {
    if (selectedDate) {
      const newEvent = {
        date: new Date(selectedDate),
        title: event.title,
        description: event.description,
        time: event.time,
      };

      if (editingEvent !== null) {
        // Estamos editando um evento existente
        const updatedEvents = [...events];
        updatedEvents[editingEvent.index] = newEvent;
        setEvents(updatedEvents);
        setEditingEvent(null);
      } else {
        // Estamos adicionando um novo evento
        setEvents([...events, newEvent]);
      }

      setShowEventForm(false);

      // Verificar se agora existem eventos para esta data
      const updatedEvents = getFilteredEvents(selectedDate);
      if (updatedEvents.length > 0) {
        setShowEventsModal(true); // Mostrar o modal após adicionar um evento
      }
    }
  };

  const handleEditEvent = (index: number) => {
    setEditingEvent({ index, event: events[index] });
    setSelectedDate(events[index].date);
    setShowEventsModal(false); // Fechar o modal de eventos
    setShowEventForm(true); // Abrir o formulário de evento
  };

  if (!mounted) return null;

  const isDarkMode = true;
  const filteredEvents = selectedDate ? getFilteredEvents(selectedDate) : [];
  const eventIndices = selectedDate ? getEventIndices(selectedDate) : [];

  return (
    <div
      className={`flex flex-col md:flex-row h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="w-full md:w-1/3 bg-[#003fba] text-[#d3d3d3] p-6 flex flex-col relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Nome da aplicação com fonte Pacifico */}
        <div className="text-center mb-4 mt-2">
          <h1 className="text-2xl font-bold flex items-center justify-center font-pacifico">
            <CalendarIcon className="mr-2 h-6 w-6" />
            Calendary
          </h1>
        </div>

        <div className="flex-grow">
          <div className="text-8xl font-bold mb-2 text-center">
            {selectedDate ? selectedDate.getDate() : today.getDate()}
          </div>
          <div className="text-xl uppercase mb-8 text-center">
            {selectedDate
              ? selectedDate.toLocaleDateString("pt-BR", { weekday: "long" })
              : today.toLocaleDateString("pt-BR", { weekday: "long" })}
          </div>

          <EventList
            events={events}
            selectedDate={selectedDate || today}
            onEditEvent={handleEditEvent}
            onDeleteEvent={(index) => {
              const newEvents = [...events];
              newEvents.splice(index, 1);
              setEvents(newEvents);
            }}
          />
        </div>

        {/* Versão da aplicação no rodapé */}
        <div className="mt-auto pt-4 text-center text-sm text-[#d3d3d3]/70">
          {appVersion}
        </div>
      </div>

      <div
        className={`w-full md:w-2/3 p-4 flex flex-col ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex-grow">
          <Calendar
            currentDate={currentDate}
            onDateChange={handleDateChange}
            onSelectDate={handleDateSelect}
            events={events}
            minYear={currentYear}
          />
        </div>

        {/* Apenas a lista de feriados do mês atual no rodapé */}
        <div
          className={`mt-auto pt-4 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {currentMonthHolidays.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              {currentMonthHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                  <span className="font-medium">{holiday.date}</span>:{" "}
                  {holiday.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs italic">
              Não há feriados nacionais neste mês.
            </p>
          )}
        </div>
      </div>

      {showEventsModal && selectedDate && filteredEvents.length > 0 && (
        <EventsModal
          selectedDate={selectedDate}
          events={filteredEvents}
          eventIndices={eventIndices}
          onClose={() => setShowEventsModal(false)}
          onAddEvent={() => {
            setShowEventsModal(false);
            setShowEventForm(true);
          }}
          onEditEvent={handleEditEvent}
          onDeleteEvent={(index) => {
            const newEvents = [...events];
            newEvents.splice(index, 1);
            setEvents(newEvents);

            // Se não houver mais eventos, fechar o modal
            if (getFilteredEvents(selectedDate).length <= 1) {
              setShowEventsModal(false);
            }
          }}
        />
      )}

      {showEventForm && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <EventForm
            onSubmit={handleAddEvent}
            onCancel={() => {
              setShowEventForm(false);
              // Se estávamos editando, voltar para o modal de eventos
              if (editingEvent !== null) {
                setShowEventsModal(true);
                setEditingEvent(null);
              }
            }}
            selectedDate={selectedDate}
            editingEvent={editingEvent?.event}
          />
        </div>
      )}
    </div>
  );
}
