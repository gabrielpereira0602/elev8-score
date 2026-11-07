"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, MapPin, RefreshCw, Search, Star } from "lucide-react";
import { buscarNegocios, concorrentesSugeridos, type Negocio } from "@/lib/busca-mock";
import { contexto } from "@/lib/contexto";
import { detectarSegmento, listaSegmentos, segmentos, type SegmentoId } from "@/lib/segmentos";
import { Analisando } from "./Analisando";

type Passo = "busca" | "confirmar" | "contato" | "analisando";

const botaoPrimario =
  "inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-brand px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50";

export function Entrada() {
  const [passo, setPasso] = useState<Passo>("busca");
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [segmento, setSegmento] = useState<SegmentoId>("generico");
  const caixaRef = useRef<HTMLDivElement>(null);
  const primeiraVez = useRef(true);

  // A cada passo, o topo do cartão volta para a tela (no celular, o passo anterior deixava a página rolada).
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    const el = caixaRef.current;
    if (!el) return;
    const topo = el.getBoundingClientRect().top + window.scrollY - 16;
    if (window.scrollY > topo || el.getBoundingClientRect().top < 0) window.scrollTo({ top: Math.max(0, topo), behavior: "smooth" });
  }, [passo]);

  const numero = passo === "busca" ? 1 : passo === "confirmar" ? 2 : 3;

  if (passo === "analisando" && negocio)
    return (
      <div ref={caixaRef} className="scroll-mt-4">
        <Analisando negocio={negocio} segmento={segmento} />
      </div>
    );

  return (
    <div ref={caixaRef} className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[0_12px_40px_-12px_rgba(5,7,13,0.25)] md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-faint">{numero === 3 ? "Último passo" : `Passo ${numero} de 3`}</p>
        <div className="flex gap-1.5" aria-hidden>
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-1.5 w-8 rounded-full ${n <= numero ? "bg-brand" : "bg-subtle"}`} />
          ))}
        </div>
      </div>

      {passo === "busca" && (
        <PassoBusca
          onEscolher={(n) => {
            setNegocio(n);
            setSegmento(detectarSegmento(n.categoria));
            setPasso("confirmar");
          }}
        />
      )}
      {passo === "confirmar" && negocio && (
        <PassoConfirmar negocio={negocio} segmento={segmento} setSegmento={setSegmento} onVoltar={() => setPasso("busca")} onSeguir={() => setPasso("contato")} />
      )}
      {passo === "contato" && <PassoContato onVoltar={() => setPasso("confirmar")} onSeguir={() => setPasso("analisando")} />}
    </div>
  );
}

function PassoBusca({ onEscolher }: { onEscolher: (n: Negocio) => void }) {
  const [termo, setTermo] = useState("");
  const [ativo, setAtivo] = useState(0);
  const [erro, setErro] = useState("");
  const listaId = useId();
  const resultados = useMemo(() => buscarNegocios(termo), [termo]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setAtivo(0), [termo]);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (resultados[ativo]) onEscolher(resultados[ativo]);
    else setErro("Escolha sua empresa na lista. Se ela não aparecer, digite o nome como está no Google.");
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <div>
        <label htmlFor="busca-empresa" className="font-display text-xl font-bold tracking-tight">
          Qual é a sua empresa?
        </label>
        <p className="mt-1 text-sm text-muted">Digite o nome como ele aparece no Google.</p>
      </div>

      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
        <input
          ref={inputRef}
          id="busca-empresa"
          type="text"
          autoComplete="off"
          placeholder="Ex.: Clínica Bella Pele"
          value={termo}
          onChange={(e) => {
            setTermo(e.target.value);
            setErro("");
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setAtivo((a) => Math.min(a + 1, resultados.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setAtivo((a) => Math.max(a - 1, 0));
            }
          }}
          role="combobox"
          aria-expanded={resultados.length > 0}
          aria-controls={listaId}
          aria-autocomplete="list"
          className="w-full rounded-[var(--radius-control)] border border-line bg-surface py-3.5 pl-11 pr-4 text-base outline-none transition-colors placeholder:text-faint focus:border-brand focus:ring-4 focus:ring-brand/15"
        />
      </div>

      {resultados.length > 0 && (
        <ul id={listaId} role="listbox" aria-label="Empresas encontradas" className="-mt-2 overflow-hidden rounded-[var(--radius-control)] border border-line">
          {resultados.map((n, i) => (
            <li key={n.id} role="option" aria-selected={i === ativo}>
              <button
                type="button"
                onMouseEnter={() => setAtivo(i)}
                onClick={() => onEscolher(n)}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                  i === ativo ? "bg-brand-soft" : "bg-surface"
                } ${i > 0 ? "border-t border-line" : ""}`}
              >
                <MapPin size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold">{n.nome}</span>
                  <span className="block truncate text-[13px] text-muted">
                    {n.categoria} · {n.endereco}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {termo.trim().length >= 2 && resultados.length === 0 && (
        <p className="-mt-1 text-sm text-muted">Nenhuma empresa encontrada com esse nome. Tente o nome exato do Google.</p>
      )}
      {erro && (
        <p role="alert" className="-mt-1 text-sm text-bad">
          {erro}
        </p>
      )}

      <button type="submit" className={botaoPrimario}>
        Continuar
        <ArrowRight size={18} aria-hidden />
      </button>
      <p className="text-center text-[13px] text-faint">Para testar, digite o começo de um nome: “Bella”, “Moura”, “Cantina”, “Studio”…</p>
    </form>
  );
}

type ConfirmarProps = {
  negocio: Negocio;
  segmento: SegmentoId;
  setSegmento: (s: SegmentoId) => void;
  onVoltar: () => void;
  onSeguir: () => void;
};

function PassoConfirmar({ negocio, segmento, setSegmento, onVoltar, onSeguir }: ConfirmarProps) {
  // Detecção pela categoria do Google (feita ao escolher a empresa), sempre confirmável. Sem correspondência, perfil genérico.
  // Protótipo: concorrentes de exemplo do nicho. Na fase 2, vêm da mesma busca no Google Maps.
  const [aviso, setAviso] = useState(false);
  const concorrentesNicho = contexto(segmento).empresa.concorrentes.map((nome, i) => ({ ...concorrentesSugeridos[i], nome }));
  const termoBusca = `${segmentos[segmento].nome.toLowerCase()} em ${negocio.endereco.split("·").pop()?.trim().split(",")[0] ?? "sua cidade"}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">Confirme a comparação</h2>
        <p className="mt-1 text-sm text-muted">Encontramos os concorrentes que aparecem para quem procura o mesmo que você.</p>
      </div>

      <div className="flex items-start gap-3 rounded-[var(--radius-control)] border-2 border-brand bg-brand-soft/40 p-4">
        <Building2 size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-ink">Sua empresa</p>
          <p className="truncate font-semibold">{negocio.nome}</p>
          <p className="truncate text-[13px] text-muted">{negocio.endereco}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tipo-negocio" className="text-[13px] font-semibold text-muted">
          Tipo de negócio
        </label>
        <select
          id="tipo-negocio"
          value={segmento}
          onChange={(e) => setSegmento(e.target.value as SegmentoId)}
          className="w-full rounded-[var(--radius-control)] border border-line bg-surface px-3.5 py-3 text-[15px] font-medium outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
        >
          {listaSegmentos.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>
        <p className="text-xs text-faint">
          {segmento === "generico"
            ? "Não reconhecemos o seu nicho pela categoria do Google. A análise funciona igual; se algum tipo acima combinar, escolha."
            : `Identificamos pela categoria no Google (“${negocio.categoria}”). Ajuste se não estiver certo.`}
        </p>
      </div>

      <div>
        <p className="mb-2 text-[13px] font-semibold text-muted">
          Vamos comparar com quem aparece em <span className="text-ink">“{termoBusca}”</span>
        </p>
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-control)] border border-line">
          {concorrentesNicho.map((c) => (
            <li key={c.nome} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium">{c.nome}</span>
                <span className="flex items-center gap-1 text-[13px] text-muted">
                  <Star size={12} className="fill-current text-warn" aria-hidden />
                  {c.nota.toLocaleString("pt-BR")} · {c.avaliacoes} avaliações · {c.endereco}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setAviso(true)}
                className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand hover:underline"
              >
                <RefreshCw size={13} aria-hidden />
                Trocar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {aviso && (
        <p role="status" className="-mt-2 rounded-[var(--radius-control)] bg-subtle px-3.5 py-2.5 text-[13px] text-muted">
          Protótipo: na versão final, aqui abre a lista dos outros negócios da mesma busca no Google para você escolher.
        </p>
      )}

      <button type="button" onClick={onSeguir} className={botaoPrimario}>
        Está certo, continuar
        <ArrowRight size={18} aria-hidden />
      </button>
      <BotaoVoltar onClick={onVoltar} />
    </div>
  );
}

function mascaraWhats(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function PassoContato({ onVoltar, onSeguir }: { onVoltar: () => void; onSeguir: () => void }) {
  const [nome, setNome] = useState("");
  const [whats, setWhats] = useState("");
  const [email, setEmail] = useState("");
  const [aceite, setAceite] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const novos: Record<string, string> = {};
    if (nome.trim().length < 2) novos.nome = "Digite seu nome.";
    if (whats.replace(/\D/g, "").length < 10) novos.whats = "Digite o WhatsApp com DDD.";
    if (!/^\S+@\S+\.\S+$/.test(email)) novos.email = "Digite um e-mail válido.";
    if (!aceite) novos.aceite = "Marque a caixa para receber seu resultado.";
    setErros(novos);
    if (Object.keys(novos).length === 0) onSeguir();
  }

  const campo =
    "w-full rounded-[var(--radius-control)] border bg-surface px-4 py-3 text-base outline-none transition-colors placeholder:text-faint focus:border-brand focus:ring-4 focus:ring-brand/15";

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight">Para onde enviamos seu resultado?</h2>
        <p className="mt-1 text-sm text-muted">Seu Score Digital abre na tela e também fica salvo num link enviado para você.</p>
      </div>

      {(
        [
          { id: "nome", rotulo: "Seu nome", valor: nome, set: setNome, tipo: "text", ph: "Ana Souza", auto: "name" },
          { id: "whats", rotulo: "WhatsApp", valor: whats, set: (v: string) => setWhats(mascaraWhats(v)), tipo: "tel", ph: "(19) 99999-9999", auto: "tel" },
          { id: "email", rotulo: "E-mail", valor: email, set: setEmail, tipo: "email", ph: "ana@suaempresa.com.br", auto: "email" },
        ] as const
      ).map((f) => (
        <div key={f.id} className="flex flex-col gap-1.5">
          <label htmlFor={`contato-${f.id}`} className="text-sm font-semibold">
            {f.rotulo}
          </label>
          <input
            id={`contato-${f.id}`}
            type={f.tipo}
            inputMode={f.id === "whats" ? "numeric" : undefined}
            autoComplete={f.auto}
            placeholder={f.ph}
            value={f.valor}
            onChange={(e) => {
              f.set(e.target.value);
              setErros((x) => ({ ...x, [f.id]: "" }));
            }}
            aria-invalid={!!erros[f.id]}
            aria-describedby={erros[f.id] ? `erro-${f.id}` : undefined}
            className={`${campo} ${erros[f.id] ? "border-bad" : "border-line"}`}
          />
          {erros[f.id] && (
            <p id={`erro-${f.id}`} className="text-[13px] text-bad">
              {erros[f.id]}
            </p>
          )}
        </div>
      ))}

      <label htmlFor="contato-aceite" className="flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-muted">
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            id="contato-aceite"
            type="checkbox"
            checked={aceite}
            onChange={(e) => {
              setAceite(e.target.checked);
              setErros((x) => ({ ...x, aceite: "" }));
            }}
            className="peer absolute inset-0 cursor-pointer appearance-none rounded-[5px] border border-line bg-surface checked:border-brand checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
          <Check size={13} strokeWidth={3} className="pointer-events-none relative text-white opacity-0 peer-checked:opacity-100" aria-hidden />
        </span>
        <span>
          Aceito receber meu resultado e contatos da Elev8 sobre ele por WhatsApp e e-mail. Posso cancelar quando quiser.{" "}
          <a href="#" className="font-semibold text-brand hover:underline">
            Política de privacidade
          </a>
        </span>
      </label>
      {erros.aceite && <p className="-mt-2 text-[13px] text-bad">{erros.aceite}</p>}

      <button type="submit" className={botaoPrimario}>
        Ver meu Score Digital grátis
        <ArrowRight size={18} aria-hidden />
      </button>
      <BotaoVoltar onClick={onVoltar} />
    </form>
  );
}

function BotaoVoltar({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="-mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
      <ArrowLeft size={15} aria-hidden />
      Voltar
    </button>
  );
}
