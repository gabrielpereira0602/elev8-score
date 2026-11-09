"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function Descadastro() {
  const [feito, setFeito] = useState(false);
  if (feito)
    return (
      <p className="flex items-start gap-2.5 rounded-[var(--radius-control)] bg-good-soft px-4 py-3 text-good" role="status">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0" aria-hidden />
        Pronto. Você não vai mais receber e-mails da Elev8. Se mudar de ideia, é só fazer um novo diagnóstico.
      </p>
    );
  return (
    <div className="flex flex-col items-start gap-4">
      <p>Confirme e paramos de enviar e-mails da Elev8 para você. Seu diagnóstico continua disponível no painel.</p>
      <button
        type="button"
        onClick={() => setFeito(true)}
        className="rounded-[var(--radius-control)] bg-ink px-5 py-3 text-[15px] font-semibold text-white hover:bg-ink/90"
      >
        Parar de receber
      </button>
    </div>
  );
}
