"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ORIGENS, etapas, temperatura, type Lead, type Temperatura } from "@/lib/admin-mock";
import { listaSegmentos, segmentos } from "@/lib/segmentos";
import { Card } from "../ui";
import { TempBadge } from "./AdminShell";

const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function ListaLeads({ leads }: { leads: Lead[] }) {
  const [busca, setBusca] = useState("");
  const [temp, setTemp] = useState<Temperatura | "todas">("todas");
  const [etapa, setEtapa] = useState("todas");
  const [nicho, setNicho] = useState("todos");

  const filtrados = useMemo(() => {
    const b = normalizar(busca.trim());
    return leads.filter(
      (l) =>
        (!b || normalizar(`${l.empresa} ${l.nome} ${l.email} ${l.cidade}`).includes(b)) &&
        (temp === "todas" || temperatura(l) === temp) &&
        (etapa === "todas" || l.etapa === etapa) &&
        (nicho === "todos" || l.segmento === nicho),
    );
  }, [leads, busca, temp, etapa, nicho]);

  const seletor = "rounded-[8px] border border-line bg-surface px-2.5 py-2 text-sm";

  return (
    <Card className="p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-bold">Leads</h2>
        <p className="text-sm text-muted">
          <span className="tabular">{filtrados.length}</span> de {leads.length}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 basis-56">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
          <input
            id="admin-busca"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por empresa, nome, e-mail ou cidade"
            aria-label="Buscar leads"
            className="w-full rounded-[8px] border border-line bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-brand"
          />
        </div>
        <div className="flex rounded-[9px] border border-line bg-surface p-0.5" role="group" aria-label="Temperatura">
          {(["todas", "quente", "morno", "frio"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTemp(t)}
              aria-pressed={temp === t}
              className={`rounded-[7px] px-2.5 py-1.5 text-[13px] font-semibold capitalize ${temp === t ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <select id="admin-etapa" aria-label="Etapa" value={etapa} onChange={(e) => setEtapa(e.target.value)} className={seletor}>
          <option value="todas">Todas as etapas</option>
          {etapas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>
        <select id="admin-nicho" aria-label="Nicho" value={nicho} onChange={(e) => setNicho(e.target.value)} className={seletor}>
          <option value="todos">Todos os nichos</option>
          {listaSegmentos.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="-mx-5 mt-4 overflow-x-auto px-5 md:mx-0 md:px-0">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[12.5px] text-muted">
              <th scope="col" className="py-2.5 pr-3 font-medium">Empresa</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Nicho</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Etapa</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Temperatura</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Score</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Kit</th>
              <th scope="col" className="py-2.5 pl-3 text-right font-medium">Diagnóstico</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((l) => (
              <tr key={l.id} className="border-b border-line last:border-0 hover:bg-subtle/60">
                <td className="py-3 pr-3">
                  <Link href={`/admin/lead/${l.id}`} className="font-semibold hover:text-brand hover:underline">
                    {l.empresa}
                  </Link>
                  <p className="text-[12.5px] text-muted">
                    {l.nome}
                    {l.origem && l.origem !== "anuncio" && <span className="ml-1.5 rounded-full bg-brand-soft px-1.5 py-px text-[11px] font-semibold text-brand-ink">{ORIGENS[l.origem]}</span>}
                    {l.scoreVivo && <span className="ml-1.5 rounded-full bg-good-soft px-1.5 py-px text-[11px] font-semibold text-good">Score Vivo</span>}
                  </p>
                </td>
                <td className="px-3 py-3 text-muted">{segmentos[l.segmento].nome}</td>
                <td className="px-3 py-3">{etapas.find((e) => e.id === l.etapa)?.nome}</td>
                <td className="px-3 py-3">
                  <TempBadge t={temperatura(l)} />
                </td>
                <td className="tabular px-3 py-3 text-right font-semibold">{l.score}</td>
                <td className="tabular px-3 py-3 text-right text-muted">{l.comprouKit ? `${l.acoesFeitas}/12` : "–"}</td>
                <td className="tabular py-3 pl-3 text-right text-muted">{l.diasDesdeDiagnostico === 0 ? "hoje" : `há ${l.diasDesdeDiagnostico} d`}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted">
                  Nenhum lead com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
