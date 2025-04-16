"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CalendarIcon, Mail, User, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string; name?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "O e-mail é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido";
      isValid = false;
    }

    if (!name) {
      newErrors.name = "O nome é obrigatório";
      isValid = false;
    }

    if (isNewUser && !password) {
      newErrors.password = "A senha é obrigatória para novos usuários";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        if (isNewUser) {
          alert(
            `Cadastro realizado com sucesso!\nE-mail: ${email}\nNome: ${name}`
          );
        } else {
          alert(`Login bem-sucedido!\nE-mail: ${email}\nNome: ${name}`);
        }
      }, 1000);
    }
  };

  const toggleMode = () => {
    setIsNewUser(!isNewUser);
    setErrors({});
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-gray-900`}
    >
      <div
        className={`w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden`}
      >
        <div className="bg-[#003fba] p-6 text-center">
          <h1 className="text-4xl font-bold flex items-center justify-center font-logo text-white">
            <CalendarIcon className="mr-2 h-8 w-8" />
            Calendary
          </h1>
          <p className="mt-2 text-[#d3d3d3]">
            {isNewUser
              ? "Crie sua conta para começar"
              : "Faça login para acessar seu calendário"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className={"text-white"}>
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 bg-gray-700 border-gray-600 text-white" `}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className={"text-white"}>
              Nome
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`pl-10 bg-gray-700 border-gray-600 text-white`}
                aria-invalid={!!errors.name}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Campo de senha que só aparece para novos usuários */}
          {isNewUser && (
            <div className="space-y-2">
              <Label htmlFor="password" className={"text-white"}>
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 bg-gray-700 border-gray-600 text-white`}
                  aria-invalid={!!errors.password}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#003fba] hover:bg-[#003fba]/80 text-[#d3d3d3]"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processando..."
              : isNewUser
              ? "Cadastrar"
              : "Entrar"}
          </Button>

          <div className="text-center mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleMode}
              className={`text-sm flex items-center justify-center mx-auto text-gray-300 hover:text-white`}
            >
              {isNewUser ? "Já tenho uma conta" : "Criar nova conta"}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
