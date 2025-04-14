"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { X, Clock } from "lucide-react";

interface EventFormProps {
  onSubmit: (event: {
    title: string;
    description?: string;
    time?: string;
  }) => void;
  onCancel: () => void;
  selectedDate: Date;
  editingEvent?: {
    date: Date;
    title: string;
    description?: string;
    time?: string;
  } | null;
}

export default function EventForm({
  onSubmit,
  onCancel,
  selectedDate,
  editingEvent,
}: EventFormProps) {
  const [title, setTitle] = useState(editingEvent?.title || "");
  const [description, setDescription] = useState(
    editingEvent?.description || ""
  );
  const [time, setTime] = useState(editingEvent?.time || "");
  const [timeError, setTimeError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Montar o componente apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validar o formato da hora (00:00)
  const validateTimeFormat = (value: string) => {
    if (!value) return true; // Campo opcional

    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Permitir apenas números e dois pontos
    if (!/^[0-9:]*$/.test(value)) return;

    // Limitar o comprimento a 5 caracteres (00:00)
    if (value.length > 5) return;

    // Adicionar automaticamente os dois pontos após os dois primeiros dígitos
    if (value.length === 2 && !value.includes(":") && time.length < 2) {
      setTime(`${value}:`);
      return;
    }

    setTime(value);

    // Validar o formato apenas se o campo não estiver vazio
    if (value && !validateTimeFormat(value)) {
      setTimeError("Formato inválido. Use HH:MM (ex: 14:30)");
    } else {
      setTimeError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar se o título está preenchido e o formato da hora é válido
    if (title.trim() && (!time || validateTimeFormat(time))) {
      onSubmit({
        title,
        description: description.trim() || undefined,
        time: time || undefined,
      });
    }
  };

  const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!mounted) return null;

  const isDarkMode = true;

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      } rounded-lg shadow-lg p-6 w-full max-w-md`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {editingEvent ? "Editar Evento" : "Adicionar Evento"}
        </h2>
        <button
          onClick={onCancel}
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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="title" className={isDarkMode ? "text-white" : ""}>
            Título do Evento
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do evento"
            required
            className={
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
            }
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="time" className={isDarkMode ? "text-white" : ""}>
            Horário (formato 00:00)
          </Label>
          <div className="relative">
            <Input
              id="time"
              type="text"
              value={time}
              onChange={handleTimeChange}
              placeholder="Ex: 14:30"
              className={`${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
              } pl-9`}
              aria-invalid={!!timeError}
            />
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {timeError && (
            <p className="text-red-500 text-xs mt-1">{timeError}</p>
          )}
        </div>

        <div className="mb-6">
          <Label
            htmlFor="description"
            className={isDarkMode ? "text-white" : ""}
          >
            Descrição (opcional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite uma descrição para o evento"
            rows={3}
            className={
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={
              isDarkMode ? "border-gray-600 text-white hover:bg-gray-700" : ""
            }
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#003fba] hover:bg-[#003fba]/80 text-[#d3d3d3]"
            disabled={!!timeError || !title.trim()}
          >
            {editingEvent ? "Atualizar" : "Salvar"} Evento
          </Button>
        </div>
      </form>
    </div>
  );
}
