"use client";

import { usePathname, useRouter } from "next/navigation";
import { nichosDemo } from "@/lib/contexto";

/** Só no protótipo: alterna grátis/pago e o nicho de exemplo, mantendo a aba atual. Sai na versão final. */
export function BarraPrototipo({ pago, nicho }: { pago: boolean; nicho: string }) {
  const router = useRouter();
  const caminho = usePathname();

  function ir(novoPago: boolean, novoNicho: string) {
    const p = new URLSearchParams();
    if (novoPago) p.set("plano", "pago");
    if (novoNicho !== "estetica") p.set("nicho", novoNicho);
    const q = p.toString();
    router.push(`${caminho}${q ? `?${q}` : ""}`);
  }

  const botao = "rounded-[7px] px-2.5 py-1 text-[12.5px] font-semibold transition-colors";

  return (
    <div className="border-b border-warn/30 bg-warn-soft/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 md:px-8">
        <span className="text-[11px] font-bold uppercase tracking-wider text-warn">Protótipo</span>
        <div className="flex rounded-[9px] border border-line bg-surface p-0.5">
          <button type="button" onClick={() => ir(false, nicho)} className={`${botao} ${!pago ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
            Grátis
          </button>
          <button type="button" onClick={() => ir(true, nicho)} className={`${botao} ${pago ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
            Pago
          </button>
        </div>
        <label className="flex min-w-0 items-center gap-2 text-[12.5px] font-semibold text-muted">
          Nicho
          <select
            id="prototipo-nicho"
            value={nicho}
            onChange={(e) => ir(pago, e.target.value)}
            className="min-w-0 max-w-[15rem] rounded-[7px] border border-line bg-surface px-2 py-1 text-[12.5px] font-medium text-ink"
          >
            {nichosDemo.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nome} · {n.empresa}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
