"use client";

import { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";

interface Event {
  date: Date;
  title: string;
  description?: string;
  time?: string;
}

interface EventsModalProps {
  selectedDate: Date;
  events: Event[];
  onClose: () => void;
  onAddEvent: () => void;
  onEditEvent: (index: number) => void;
  onDeleteEvent: (index: number) => void;
  eventIndices: number[];
}

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

  // Ordenar eventos do mais recente para o mais antigo (assumindo que o último adicionado é o mais recente)
  const sortedEvents = [...events].reverse();
  const sortedIndices = [...eventIndices].reverse();

  // Montar o componente apenas no cliente para evitar problemas de hidratação
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

  const isDarkMode = true;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded-lg shadow-lg p-6 w-full max-w-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Compromissos
          </h2>
          <button
            onClick={onClose}
            className={`${
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
          {formattedDate}
        </p>

        <div className="mb-6">
          {/* Evento mais recente */}
          {sortedEvents.length > 0 && (
            <div
              className={`p-4 rounded-md mb-4 ${
                isDarkMode
                  ? "bg-[#003fba]/30 text-white"
                  : "bg-[#003fba]/10 text-gray-800"
              }`}
            >
              <h3 className="font-bold text-lg mb-1">Evento mais recente:</h3>
              <div className="min-h-[60px]">
                <p className="font-medium">{sortedEvents[0].title}</p>
                {sortedEvents[0].time && (
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } text-sm mt-1`}
                  >
                    Horário: {sortedEvents[0].time}
                  </p>
                )}
                {sortedEvents[0].description && (
                  <p
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } text-sm mt-1`}
                  >
                    {sortedEvents[0].description}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => onEditEvent(sortedIndices[0])}
                  className={`p-1 rounded ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteEvent(sortedIndices[0])}
                  className={`p-1 rounded ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Outros eventos */}
          {sortedEvents.length > 1 && (
            <>
              <h3
                className={`font-bold mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Outros compromissos:
              </h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {sortedEvents.slice(1).map((event, index) => (
                  <li
                    key={index}
                    className={`p-3 rounded-md ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    } group transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{event.title}</h3>
                        {event.time && (
                          <p
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            } text-sm`}
                          >
                            Horário: {event.time}
                          </p>
                        )}
                        {event.description && (
                          <p
                            className={`${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            } text-sm mt-1`}
                          >
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
                          className={`${
                            isDarkMode
                              ? "text-gray-300 hover:text-white"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvent(sortedIndices[index + 1]);
                          }}
                          className={`${
                            isDarkMode
                              ? "text-gray-300 hover:text-white"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
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
            className={
              isDarkMode ? "border-gray-600 text-white hover:bg-gray-700" : ""
            }
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
