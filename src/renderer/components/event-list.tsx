"use client";

import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Event {
  date: Date;
  commitment: string;
  description?: string;
  time?: string;
}

interface EventListProps {
  events: Event[];
  selectedDate: Date;
  onEditEvent: (index: number) => void;
  onDeleteEvent: (index: number) => void;
}

export default function EventList({
  events,
  selectedDate,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) {
  const [mounted, setMounted] = useState(false);

  // Montar o componente apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtrar eventos para a data selecionada
  const filteredEvents = events.filter(
    (event) =>
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
  );

  // Encontrar os índices originais dos eventos filtrados
  const eventIndices = events
    .map((event, index) => {
      if (
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      ) {
        return index;
      }
      return -1;
    })
    .filter((index) => index !== -1);

  if (!mounted) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl mb-4">Eventos Atuais:</h2>

      {filteredEvents.length === 0 ? (
        <div className="text-[#d3d3d3]/80">
          <p>- Não há eventos para esta data</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredEvents.map((event, index) => (
            <li key={index} className="border-l-2 border-[#d3d3d3] pl-3 group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{event.commitment}</h3>
                  {event.time && (
                    <p className="text-[#d3d3d3]/90 text-sm">
                      Horário: {event.time}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-[#d3d3d3]/80 text-sm">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEvent(eventIndices[index]);
                    }}
                    className="text-[#d3d3d3] hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEvent(eventIndices[index]);
                    }}
                    className="text-[#d3d3d3] hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
