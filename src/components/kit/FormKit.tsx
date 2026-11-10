"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Wand2 } from "lucide-react";
import type { FormKit as Dados } from "@/lib/real/analise";
import { Card } from "../ui";

const campo = "w-full min-w-0 rounded-[8px] border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand";

/** Depois da compra: 1 minuto para o kit sair com o serviço, o preço, o diferencial e as cores do próprio negócio. */
export function FormKit({ codigo, permitePreco, inicial, exemploServico }: { codigo: string; permitePreco: boolean; inicial?: Dados; exemploServico: string }) {
  const router = useRouter();
  const [f, setF] = useState<Dados>({ servico: "", preco: "", diferencial: "", cor: "#0066FF", bio: "", ...inicial });
  const [estado, setEstado] = useState<"" | "salvando" | "ok" | "erro">("");
  const completo = !!inicial?.servico && !!inicial?.diferencial;
  const [aberto, setAberto] = useState(!completo);
  const set = (k: keyof Dados) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!f.servico?.trim() || !f.diferencial?.trim()) return setEstado("erro");
    setEstado("salvando");
    const r = await fetch("/api/kit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ d: codigo, form: f }) }).catch(() => null);
    if (r?.ok) {
      setEstado("ok");
      setAberto(false);
      router.refresh();
    } else setEstado("erro");
  }

  if (!aberto)
    return (
      <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <CheckCircle2 size={16} className="text-good" aria-hidden />
        Kit montado com os dados do seu negócio.
        <button type="button" onClick={() => setAberto(true)} className="font-semibold text-brand hover:underline">
          Editar dados
        </button>
      </p>
    );

  return (
    <Card destaque className="p-5">
      <form onSubmit={salvar} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Wand2 size={18} className="text-brand" aria-hidden />
          <h2 className="font-display text-base font-bold">Deixe o kit com a cara do seu negócio (1 minuto)</h2>
        </div>
        <p className="text-sm text-muted">Com isso, mensagens, bios e posts saem com o seu serviço e o seu diferencial, em vez de texto genérico.</p>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-[13px] font-semibold text-muted">
            Serviço principal *
            <input value={f.servico} onChange={set("servico")} maxLength={80} placeholder={`Ex.: ${exemploServico}`} className={campo} />
          </label>
          {permitePreco && (
            <label className="flex flex-col gap-1 text-[13px] font-semibold text-muted">
              Preço a partir de (opcional)
              <input value={f.preco} onChange={set("preco")} maxLength={30} placeholder="Ex.: R$ 180" className={campo} />
            </label>
          )}
          <label className="flex flex-col gap-1 text-[13px] font-semibold text-muted md:col-span-2">
            O que faz você diferente dos concorrentes? *
            <input value={f.diferencial} onChange={set("diferencial")} maxLength={140} placeholder="Ex.: atendimento com hora marcada, sem espera" className={campo} />
          </label>
          <label className="flex flex-col gap-1 text-[13px] font-semibold text-muted md:col-span-2">
            Sua bio atual do Instagram (opcional)
            <textarea value={f.bio} onChange={set("bio")} maxLength={300} rows={2} className={campo} />
          </label>
          <label className="flex items-center gap-3 text-[13px] font-semibold text-muted">
            Cor principal da marca
            <input type="color" value={f.cor || "#0066FF"} onChange={set("cor")} className="h-9 w-14 cursor-pointer rounded border border-line bg-surface" />
          </label>
        </div>
        {estado === "erro" && <p className="text-sm text-bad">Preencha o serviço principal e o diferencial.</p>}
        <button type="submit" disabled={estado === "salvando"} className="self-start rounded-[var(--radius-control)] bg-brand px-5 py-3 text-[15px] font-semibold text-white hover:bg-brand-hover disabled:opacity-60">
          {estado === "salvando" ? "Salvando…" : "Montar meu kit"}
        </button>
      </form>
    </Card>
  );
}
