"use client";

import { useState, useEffect } from "react";
import Calendar from "../components/calendar";
import EventForm from "../components/event-form";
import EventList from "../components/event-list";
import EventsModal from "../components/events-modal";
import { CalendarRangeIcon } from "lucide-react";
import {
  getCurrentMonthHolidays,
  getEventIndices,
  getFilteredEvents
} from "renderer/lib/functions";
import Header from "renderer/components/header";

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

  const appVersion = "v1.0.0";

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();
  const currentYear = today.getFullYear();

  const currentMonthHolidays = getCurrentMonthHolidays(currentDate);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    setSelectedDate(date);

    const dateEvents = getFilteredEvents(date, events);

    if (dateEvents.length > 0) {
      setShowEventsModal(true);
    } else {
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
        time: event.time
      };

      if (editingEvent !== null) {
        const updatedEvents = [...events];
        updatedEvents[editingEvent.index] = newEvent;
        setEvents(updatedEvents);
        setEditingEvent(null);
      } else {
        setEvents([...events, newEvent]);
      }

      setShowEventForm(false);

      const updatedEvents = getFilteredEvents(selectedDate, events);
      if (updatedEvents.length > 0) {
        setShowEventsModal(true);
      }
    }
  };

  const handleEditEvent = (index: number) => {
    setEditingEvent({ index, event: events[index] });
    setSelectedDate(events[index].date);
    setShowEventsModal(false);
    setShowEventForm(true);
  };

  if (!mounted) return null;

  const filteredEvents = selectedDate
    ? getFilteredEvents(selectedDate, events)
    : [];
  const eventIndices = selectedDate
    ? getEventIndices(selectedDate, events)
    : [];

  return (
    <>
      <div className={"flex flex-col h-screen bg-gray-900"}>
        <Header />

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="w-full md:w-1/3 bg-[#003fba] text-[#d3d3d3] p-6 flex flex-col relative">
            {/* Nome da aplicação com fonte Pacifico */}
            <div className="text-center mb-4 mt-2">
              <h1 className="text-2xl font-bold flex items-center justify-center font-pacifico">
                <CalendarRangeIcon className="mr-2 h-6 w-6" />
                Calendary
              </h1>
            </div>

            <div className="flex-grow">
              <div className="text-8xl font-bold mb-2 text-center">
                {selectedDate ? selectedDate.getDate() : today.getDate()}
              </div>
              <div className="text-xl uppercase mb-8 text-center">
                {selectedDate
                  ? selectedDate.toLocaleDateString("pt-BR", {
                      weekday: "long"
                    })
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
            className={
              "w-full md:w-2/3 p-4 flex flex-col bg-gray-900 text-white"
            }
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
            <div className={"mt-auto pt-4 text-gray-400"}>
              {currentMonthHolidays.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
                  {currentMonthHolidays.map((holiday, index) => (
                    <div key={index} className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-1" />
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
              if (getFilteredEvents(selectedDate, events).length <= 1) {
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
    </>
  );
}
