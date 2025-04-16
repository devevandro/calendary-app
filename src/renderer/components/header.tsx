"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, User, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "../components/theme-toggle";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Montar o componente apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDarkMode = true;

  return (
    <header
      className={`draggable pb-2 w-full ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-b shadow-sm sticky top-0 z-10`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Menu mobile toggle */}
        <div className="md:hidden flex items-center"></div>
      </div>
    </header>
  );
}
