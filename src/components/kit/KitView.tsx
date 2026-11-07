"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Camera, Check, CheckCircle2, Circle, Clock, Download, ImageIcon, Lightbulb, Printer, ShieldAlert, Sparkles } from "lucide-react";
import type { EmpresaDemo, Kit, Peca } from "@/lib/contexto";
import type { Segmento } from "@/lib/segmentos";
import { CopyButton } from "../CopyButton";
import { Card } from "../ui";
import { Plaquinha } from "./Plaquinha";
import { PostArt } from "./PostArt";
import { gerarPosts } from "@/lib/posts";
import { formatarBRL, servico } from "@/lib/elev8";


/** O serviço da Elev8 que resolve cada peça. Aparece no momento em que o empresário vê o trabalho que dá. */
const servicoElev8: Record<Peca["id"], { texto: string; servicoId: string }> = {
  avaliacoes: { texto: "o seu Google Perfil e as avaliações", servicoId: "seo-local" },
  whatsapp: { texto: "anúncios que trazem mais conversas para o seu WhatsApp", servicoId: "meta-essencial" },
  perfil: { texto: "a sua identidade visual e as redes sociais", servicoId: "branding" },
  google: { texto: "o seu Google Perfil", servicoId: "seo-local" },
  posts: { texto: "a gestão das suas redes sociais", servicoId: "redes" },
};

function precoAPartir(id: string) {
  const s = servico(id);
  return s.preco === undefined ? "orçamento sob consulta" : `a partir de ${formatarBRL(s.preco)}${s.cobranca === "mensal" ? "/mês" : ""}`;
}

export function KitView({ empresa, segmento, kit, qs }: { empresa: EmpresaDemo; segmento: Segmento; kit: Kit; qs: string }) {
  const pecas = kit.pecas;
  const [ativa, setAtiva] = useState<Peca["id"]>("avaliacoes");
  const [feitas, setFeitas] = useState<Set<Peca["id"]>>(new Set());
  const peca = pecas.find((p) => p.id === ativa)!;
  const feita = feitas.has(ativa);

  function alternarFeita() {
    setFeitas((f) => {
      const n = new Set(f);
      if (n.has(ativa)) n.delete(ativa);
      else n.add(ativa);
      return n;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-[28px]">Seu kit pronto</h1>
          <p className="mt-1 text-sm text-muted">5 peças feitas para {empresa.nome}, a partir do seu diagnóstico.</p>
        </div>
        <p className="text-sm text-muted">
          <b className="tabular font-semibold text-ink">{feitas.size} de {pecas.length}</b> peças aplicadas
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <nav aria-label="Peças do kit" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-2 lg:flex-col">
            {pecas.map((p) => {
              const atual = p.id === ativa;
              const ok = feitas.has(p.id);
              return (
                <li key={p.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setAtiva(p.id)}
                    aria-current={atual ? "true" : undefined}
                    className={`flex w-full items-center gap-3 rounded-[12px] border px-3.5 py-3 text-left transition-colors ${
                      atual ? "border-brand bg-surface shadow-[0_0_0_3px_rgba(0,102,255,0.12)]" : "border-line bg-surface hover:border-faint"
                    }`}
                  >
                    {ok ? (
                      <CheckCircle2 size={20} className="shrink-0 text-good" aria-label="aplicada" />
                    ) : (
                      <Circle size={20} className="shrink-0 text-line" aria-hidden />
                    )}
                    <span className="min-w-0">
                      <span className="block whitespace-nowrap text-[15px] font-semibold">{p.nome}</span>
                      <span className="hidden text-xs text-muted lg:block">
                        Melhora: {p.etapa} · {p.tempo}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <Card className="min-w-0 p-5 md:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold text-brand">Melhora: {peca.etapa}</p>
                <h2 className="mt-0.5 font-display text-2xl font-extrabold tracking-tight">{peca.nome}</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-2.5 py-1 text-xs font-semibold text-muted">
                <Clock size={13} aria-hidden />
                {peca.tempo}
              </span>
            </div>

            <div className="flex gap-3 rounded-[var(--radius-control)] bg-brand-soft/60 p-4">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
              <p className="text-[15px] leading-relaxed">
                <b className="font-semibold">Por que isso importa: </b>
                {peca.porQue}
              </p>
            </div>

            {ativa === "avaliacoes" && <ConteudoAvaliacoes empresa={empresa} kit={kit} />}
            {ativa === "whatsapp" && <ConteudoWhatsapp kit={kit} />}
            {ativa === "perfil" && <ConteudoPerfil kit={kit} />}
            {ativa === "google" && <ConteudoGoogle kit={kit} />}
            {ativa === "posts" && <ConteudoPosts empresa={empresa} segmento={segmento} />}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <p className="text-sm text-muted">{feita ? "Ótimo. Isso já conta na sua reavaliação." : "Aplicou? Marque para acompanhar seu plano."}</p>
              <button
                type="button"
                onClick={alternarFeita}
                className={`inline-flex items-center gap-2 rounded-[var(--radius-control)] px-4 py-2.5 text-sm font-semibold transition-colors ${
                  feita ? "bg-good-soft text-good" : "bg-ink text-white hover:bg-ink/85"
                }`}
              >
                <Check size={16} aria-hidden />
                {feita ? "Aplicada" : "Marcar como aplicada"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-control)] bg-subtle px-4 py-3.5">
            <p className="text-sm text-muted">
              <b className="font-semibold text-ink">Prefere não fazer sozinho?</b> A Elev8 aplica isso para você e cuida de {servicoElev8[ativa].texto} ({precoAPartir(servicoElev8[ativa].servicoId)}). Por ter comprado o kit, você tem desconto.
            </p>
            <Link href={`/painel/elev8${qs}`} className="shrink-0 text-sm font-semibold text-brand hover:underline">
              Quero que a Elev8 faça
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Bloco({ titulo, sub, texto, mono = false }: { titulo: string; sub?: string; texto: string; mono?: boolean }) {
  return (
    <div className="rounded-[var(--radius-control)] border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{titulo}</p>
          {sub && <p className="text-xs text-muted">{sub}</p>}
        </div>
        <CopyButton texto={texto} />
      </div>
      <p className={`whitespace-pre-line px-4 py-3 text-[15px] leading-relaxed ${mono ? "font-medium" : ""}`}>{texto}</p>
    </div>
  );
}

function Subtitulo({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-base font-bold">{children}</h3>;
}

function ConteudoAvaliacoes({ empresa, kit }: { empresa: EmpresaDemo; kit: Kit }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_16rem] md:items-start">
        <div className="flex flex-col gap-3">
          <Subtitulo>1. A plaquinha para o balcão</Subtitulo>
          <p className="text-[15px] leading-relaxed text-muted">
            Imprima e deixe na recepção ou no espelho. Quem gostou do atendimento aponta a câmera e avalia na hora.
          </p>
          <ul className="flex flex-col gap-1.5 text-sm text-muted">
            <li>· Arquivo em PDF, tamanho A6 (cabe num porta-retrato)</li>
            <li>· O QR code abre direto a tela de avaliação da sua empresa</li>
            <li>· Entrega digital: você imprime; não enviamos placa física</li>
          </ul>
          <div className="mt-1 flex flex-wrap gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
              <Download size={16} aria-hidden />
              Baixar arte para imprimir
            </button>
            <CopyButton texto={kit.linkAvaliacao} rotulo="Copiar link de avaliação" className="py-2.5" />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-faint">
            <Printer size={13} aria-hidden />
            Dica: papel fotográfico ou couché deixa o QR mais nítido.
          </p>
        </div>
        <Plaquinha empresa={empresa.nome} link={kit.linkAvaliacao} cor={empresa.cor} />
      </div>

      <div className="flex flex-col gap-3">
        <Subtitulo>2. Mensagens para pedir avaliação</Subtitulo>
        {kit.mensagensAvaliacao.map((m) => (
          <Bloco key={m.titulo} titulo={m.titulo} texto={m.texto} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Subtitulo>3. Como responder as avaliações</Subtitulo>
        <p className="text-sm text-muted">Responder todas, boas e ruins, mostra cuidado para quem está escolhendo.</p>
        {kit.respostasAvaliacao.map((m) => (
          <Bloco key={m.titulo} titulo={m.titulo} texto={m.texto} />
        ))}
      </div>
    </div>
  );
}

function ConteudoWhatsapp({ kit }: { kit: Kit }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        Salve como respostas rápidas no WhatsApp Business: Configurações → Ferramentas comerciais → Respostas rápidas.
      </p>
      {kit.mensagensWhatsapp.map((m) => (
        <Bloco key={m.titulo} titulo={m.titulo} sub={m.sub} texto={m.texto} />
      ))}
    </div>
  );
}

function ConteudoPerfil({ kit }: { kit: Kit }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[var(--radius-control)] border border-dashed border-line px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">Sua bio hoje</p>
        <p className="mt-1 text-[15px] text-muted">{kit.bioAtual}</p>
      </div>
      <p className="text-sm text-muted">Escolha a versão com mais a sua cara e troque no Instagram.</p>
      {kit.bios.map((b) => (
        <Bloco key={b.titulo} titulo={`Versão ${b.titulo.toLowerCase()}`} texto={b.texto} mono />
      ))}
    </div>
  );
}

function ConteudoGoogle({ kit }: { kit: Kit }) {
  return (
    <div className="flex flex-col gap-5">
      <Bloco titulo="Descrição da empresa" sub="Cole em: Google Perfil → Editar perfil → Descrição" texto={kit.googleDescricao} />
      <div className="flex flex-col gap-3">
        <Subtitulo>O que falta preencher</Subtitulo>
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-control)] border border-line">
          {kit.googleFaltando.map((g) => (
            <li key={g.item} className="flex gap-3 px-4 py-3">
              <Circle size={18} className="mt-0.5 shrink-0 text-faint" aria-hidden />
              <span>
                <span className="block text-[15px] font-semibold">{g.item}</span>
                <span className="text-sm text-muted">{g.detalhe}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const coresTeste = ["#B5476B", "#0E8A8A", "#1F2A44", "#C0392B", "#F2C230", "#2E8B57", "#5B4BDB"];

function ConteudoPosts({ empresa: base, segmento: seg }: { empresa: EmpresaDemo; segmento: Segmento }) {
  const [cor, setCor] = useState(base.cor);
  const [semana, setSemana] = useState(1);
  const [promptAberto, setPromptAberto] = useState<string | null>(null);

  const empresa = { ...base, cor };
  const todos = useMemo(() => gerarPosts(empresa), [base.nome, cor]); // eslint-disable-line react-hooks/exhaustive-deps
  const lista = todos.filter((p) => p.semana === semana);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--radius-control)] border border-dashed border-warn/50 bg-warn-soft/40 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-warn">Protótipo · teste outra cor da marca</p>
        <div className="flex flex-wrap gap-1.5">
          {coresTeste.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCor(c)}
              aria-label={`Usar a cor ${c}`}
              aria-pressed={c === cor}
              className={`size-6 rounded-full ring-offset-2 transition ${c === cor ? "ring-2 ring-ink" : ""}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 rounded-[var(--radius-control)] border border-line p-4">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden />
        <div className="text-sm">
          <p className="font-semibold">Regras do seu setor, já seguidas nos posts</p>
          <ul className="mt-1 flex flex-col gap-0.5 text-muted">
            {seg.regras.map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Semanas">
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={s === semana}
            onClick={() => setSemana(s)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              s === semana ? "bg-ink text-white" : "bg-subtle text-muted hover:text-ink"
            }`}
          >
            Semana {s}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {lista.map((p) => (
          <li key={p.gancho + p.semana} className="flex flex-col overflow-hidden rounded-[12px] border border-line">
            {p.tipo === "Arte pronta" ? (
              <PostArt gancho={p.gancho} empresa={empresa.nome} cor={empresa.cor} layout={p.layout!} variante={p.variante!} />
            ) : (
              <div className="flex aspect-square flex-col items-center justify-center gap-2 bg-subtle p-5 text-center">
                <Camera size={26} className="text-muted" aria-hidden />
                <p className="text-[13px] font-semibold text-muted">Foto sua</p>
                <p className="text-sm">{p.foto}</p>
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2 p-3.5">
              <span className="inline-flex items-center gap-1 self-start text-xs font-semibold text-muted">
                {p.tipo === "Arte pronta" ? <ImageIcon size={13} aria-hidden /> : <Camera size={13} aria-hidden />}
                {p.tipo}
              </span>
              {p.tipo === "Foto sua" && <p className="text-sm font-semibold">{p.gancho}</p>}
              <p className="line-clamp-4 text-sm leading-relaxed text-muted">{p.legenda}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                <CopyButton texto={p.legenda} rotulo="Legenda" />
                {p.tipo === "Arte pronta" && (
                  <button type="button" className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[13px] font-semibold hover:border-brand hover:text-brand">
                    <Download size={14} aria-hidden />
                    Arte
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPromptAberto(promptAberto === p.gancho ? null : p.gancho)}
                  aria-expanded={promptAberto === p.gancho}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[13px] font-semibold hover:border-brand hover:text-brand"
                >
                  <Sparkles size={14} aria-hidden />
                  Prompt
                </button>
              </div>
              {promptAberto === p.gancho && (
                <div className="mt-1 rounded-[8px] bg-subtle p-3">
                  <p className="text-xs font-semibold text-muted">
                    {p.tipo === "Arte pronta" ? "Para recriar a arte no Canva IA ou no ChatGPT" : "Para tirar a foto com cara profissional"}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed">{p.prompt}</p>
                  <CopyButton texto={p.prompt} rotulo="Copiar prompt" className="mt-2" />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
