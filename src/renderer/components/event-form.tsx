"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { X, Clock } from "lucide-react";
import { EventFormProps } from "renderer/lib/interfaces";
import { validateTimeFormat } from "renderer/lib/functions";

export default function EventForm({
  onSubmit,
  onCancel,
  selectedDate,
  editingEvent,
}: EventFormProps) {
  const [commitment, setCommitment] = useState(editingEvent?.commitment || "");
  const [description, setDescription] = useState(
    editingEvent?.description || ""
  );
  const [time, setTime] = useState(editingEvent?.time || "");
  const [timeError, setTimeError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^[0-9:]*$/.test(value)) return;

    if (value.length > 5) return;

    if (value.length === 2 && !value.includes(":") && time.length < 2) {
      setTime(`${value}:`);
      return;
    }

    setTime(value);

    if (value && !validateTimeFormat(value)) {
      setTimeError("Formato inválido. Use HH:MM (ex: 14:30)");
    } else {
      setTimeError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (commitment.trim() && (!time || validateTimeFormat(time))) {
      const data = {
        commitment,
        description: description.trim() || undefined,
        time: time || undefined,
      };
      await window.App.saveCommitment(data);
      const response = await window.App.fetchCommitments();
      console.log(response.data);
      onSubmit({
        commitment,
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

  return (
    <div
      className={`bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-md`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {editingEvent ? "Editar Evento" : "Adicionar Evento"}
        </h2>
        <button onClick={onCancel} className={`text-gray-300 hover:text-white`}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className={`text-gray-300 mb-4`}>{formattedDate}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="title" className={"text-white"}>
            Título do Evento
          </Label>
          <Input
            id="title"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            placeholder="Digite o título do evento"
            required
            className={"bg-gray-700 border-gray-600 text-white"}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="time" className={"text-white"}>
            Horário (formato 00:00)
          </Label>
          <div className="relative">
            <Input
              id="time"
              type="text"
              value={time}
              onChange={handleTimeChange}
              placeholder="Ex: 14:30"
              className={`bg-gray-700 border-gray-600 text-white pl-9`}
              aria-invalid={!!timeError}
            />
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {timeError && (
            <p className="text-red-500 text-xs mt-1">{timeError}</p>
          )}
        </div>

        <div className="mb-6">
          <Label htmlFor="description" className={"text-white"}>
            Descrição (opcional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite uma descrição para o evento"
            rows={3}
            className={"bg-gray-700 border-gray-600 text-white"}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={
              "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            }
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#003fba] hover:bg-[#003fba]/80 text-[#d3d3d3]"
            disabled={!!timeError || !commitment.trim()}
          >
            {editingEvent ? "Atualizar" : "Salvar"} Evento
          </Button>
        </div>
      </form>
    </div>
  );
}
