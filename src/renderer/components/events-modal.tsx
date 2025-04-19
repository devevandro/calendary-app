"use client";

import { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { EventsModalProps } from "renderer/lib/interfaces";

export default function EventsModal({
  selectedDate,
  events,
  onClose,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  eventIndices,
}: EventsModalProps) {
  const [mounted, setMounted] = useState(false);

  const sortedEvents = [...events].reverse();
  const sortedIndices = [...eventIndices].reverse();

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-10">
      <div
        className={`bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Compromissos
          </h2>
          <button
            onClick={onClose}
            className={`text-gray-300 hover:text-white`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className={`text-gray-300 mb-4`}>{formattedDate}</p>

        <div className="mb-6">
          {sortedEvents.length > 0 && (
            <div className={`p-4 rounded-md mb-4 $bg-[#003fba]/30 text-white`}>
              <h3 className="font-bold text-lg mb-1">Evento mais recente:</h3>
              <div className="min-h-[60px]">
                <p className="font-medium">{sortedEvents[0].commitment}</p>
                {sortedEvents[0].time && (
                  <p className={`text-gray-300 text-sm mt-1`}>
                    Horário: {sortedEvents[0].time}
                  </p>
                )}
                {sortedEvents[0].description && (
                  <p className={`text-gray-400 text-sm mt-1`}>
                    {sortedEvents[0].description}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => onEditEvent(sortedIndices[0])}
                  className={`p-1 rounded hover:bg-gray-700`}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteEvent(sortedIndices[0])}
                  className={`p-1 rounded hover:bg-gray-700`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {sortedEvents.length > 1 && (
            <>
              <h3 className={`font-bold mb-2 text-gray-300`}>
                Outros compromissos:
              </h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {sortedEvents.slice(1).map((event, index) => (
                  <li
                    key={index}
                    className={`p-3 rounded-md bg-gray-700 hover:bg-gray-600 group transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{event.commitment}</h3>
                        {event.time && (
                          <p className={`text-gray-300 text-sm`}>
                            Horário: {event.time}
                          </p>
                        )}
                        {event.description && (
                          <p className={`text-gray-400 text-sm mt-1`}>
                            {event.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent(sortedIndices[index + 1]);
                          }}
                          className={`text-gray-300 hover:text-white`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvent(sortedIndices[index + 1]);
                          }}
                          className={`text-gray-300 hover:text-white}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className={"border-gray-600 text-white hover:bg-gray-700"}
          >
            Fechar
          </Button>
          <Button
            type="button"
            onClick={onAddEvent}
            className="bg-[#003fba] hover:bg-[#003fba]/80 text-[#d3d3d3] flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar Evento
          </Button>
        </div>
      </div>
    </div>
  );
}
