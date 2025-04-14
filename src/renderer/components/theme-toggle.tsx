"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  // Montar o componente apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      className="rounded-full bg-[#003fba]/30 hover:bg-[#003fba]/50 text-white p-2"
      aria-label="Alternar tema"
    >
      <Sun className="h-5 w-5" />
    </button>
  );
}
