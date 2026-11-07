"use client";

import { useRef, useState } from "react";
import { Check, Copy, Gift } from "lucide-react";
import { Card } from "./ui";

/** Versão grátis: a primeira peça do kit, liberada de presente. Prova a qualidade antes do preço. */
export function GiftAction({ titulo, motivo, mensagem }: { titulo: string; motivo: string; mensagem: string }) {
  const [copiado, setCopiado] = useState(false);
  const textoRef = useRef<HTMLParagraphElement>(null);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(mensagem);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      // Sem acesso à área de transferência: seleciona o texto para o usuário copiar.
      const el = textoRef.current;
      if (!el) return;
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = window.getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
  }

  return (
    <Card className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:p-6">
      <div className="flex flex-col gap-2.5">
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-ink">
          <Gift size={14} aria-hidden />
          Primeira ação liberada de presente
        </span>
        <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-balance">{titulo}</h2>
        <p className="text-[15px] leading-relaxed text-muted">{motivo}</p>
        <p className="text-[13px] text-faint">Esta é uma das peças do seu kit. As outras estão logo abaixo.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-[var(--radius-control)] bg-subtle p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Mensagem pronta para o WhatsApp</p>
        <p ref={textoRef} className="whitespace-pre-line text-[15px] leading-relaxed">
          {mensagem}
        </p>
        <button
          type="button"
          onClick={copiar}
          className="mt-1 inline-flex items-center justify-center gap-2 self-start rounded-[var(--radius-control)] border border-line bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {copiado ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {copiado ? "Mensagem copiada" : "Copiar mensagem"}
        </button>
      </div>
    </Card>
  );
}
