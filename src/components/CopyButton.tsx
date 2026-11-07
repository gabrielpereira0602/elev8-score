"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ texto, rotulo = "Copiar", className = "" }: { texto: string; rotulo?: string; className?: string }) {
  const [estado, setEstado] = useState<"livre" | "copiado" | "erro">("livre");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setEstado("copiado");
    } catch {
      setEstado("erro");
    }
    window.setTimeout(() => setEstado("livre"), 2200);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        estado === "copiado" ? "border-good text-good" : ""
      } ${className}`}
    >
      {estado === "copiado" ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      {estado === "copiado" ? "Copiado" : estado === "erro" ? "Selecione e copie" : rotulo}
    </button>
  );
}
