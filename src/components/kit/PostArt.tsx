import { Quote, Star } from "lucide-react";
import { paleta, type Layout, type Variante } from "@/lib/posts";

type Props = { gancho: string; empresa: string; cor: string; layout: Layout; variante: Variante };

function iniciais(nome: string) {
  return nome
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/**
 * Arte do post desenhada com a identidade da empresa. Os tamanhos de letra usam a largura da
 * própria arte (cqw), então ela fica proporcional em qualquer tela e na exportação em 1080x1080.
 */
export function PostArt({ gancho, empresa, cor, layout, variante }: Props) {
  const p = paleta(cor, variante);

  const assinatura = (
    <div className="flex items-center gap-[2.5cqw]" style={{ color: p.suave }}>
      <span
        className="grid size-[9cqw] place-items-center rounded-full font-display font-extrabold"
        style={{ background: p.destaque, color: p.fundo, fontSize: "3.6cqw" }}
      >
        {iniciais(empresa) || empresa[0]}
      </span>
      <span className="truncate font-semibold" style={{ fontSize: "3.6cqw" }}>
        {empresa}
      </span>
    </div>
  );

  const titulo = (tamanho: string, extra = "") => (
    <p className={`font-display font-extrabold leading-[1.08] tracking-tight text-balance ${extra}`} style={{ fontSize: tamanho, color: p.texto }}>
      {gancho}
    </p>
  );

  return (
    <div className="@container relative aspect-square w-full overflow-hidden" style={{ background: p.fundo, containerType: "inline-size" }}>
      <div className="absolute inset-0 flex flex-col p-[7cqw]">
        {layout === "destaque" && (
          <>
            {assinatura}
            <span className="mt-[6cqw] block h-[1.4cqw] w-[16cqw] rounded-full" style={{ background: p.destaque }} />
            <div className="mt-auto">{titulo("8.6cqw")}</div>
          </>
        )}

        {layout === "carrossel" && (
          <>
            <p className="font-semibold uppercase tracking-[0.12em]" style={{ fontSize: "3.4cqw", color: p.destaque }}>
              Guia rápido
            </p>
            <div className="mt-[4cqw]">{titulo("8.4cqw")}</div>
            <div className="mt-auto flex items-center justify-between">
              {assinatura}
              <span className="font-semibold" style={{ fontSize: "3.6cqw", color: p.destaque }}>
                Arraste →
              </span>
            </div>
          </>
        )}

        {layout === "pergunta" && (
          <>
            <span
              className="pointer-events-none absolute -right-[4cqw] -top-[10cqw] font-display font-extrabold leading-none opacity-15"
              style={{ fontSize: "70cqw", color: p.destaque }}
              aria-hidden
            >
              ?
            </span>
            <div className="relative mt-auto mb-auto">{titulo("9cqw")}</div>
            <div className="relative">{assinatura}</div>
          </>
        )}

        {layout === "mito" && (
          <>
            <div className="flex gap-[2.5cqw]">
              {["Mito", "Verdade"].map((t, i) => (
                <span
                  key={t}
                  className="rounded-full font-bold uppercase tracking-wide"
                  style={{
                    fontSize: "3.6cqw",
                    padding: "1.6cqw 4cqw",
                    background: i === 0 ? p.destaque : "transparent",
                    color: i === 0 ? p.fundo : p.destaque,
                    border: `0.5cqw solid ${p.destaque}`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="my-auto">{titulo("8.4cqw")}</div>
            {assinatura}
          </>
        )}

        {layout === "aviso" && (
          <>
            <p className="self-start rounded-full font-bold uppercase tracking-wide" style={{ fontSize: "3.4cqw", padding: "1.6cqw 4cqw", background: p.destaque, color: p.fundo }}>
              Agenda da semana
            </p>
            <div className="mt-[6cqw]">{titulo("10cqw")}</div>
            <p className="mt-[3cqw]" style={{ fontSize: "4.4cqw", color: p.suave }}>
              Ainda temos horários disponíveis
            </p>
            <div className="mt-auto flex items-center justify-between gap-[3cqw]">
              {assinatura}
              <span className="shrink-0 rounded-full font-semibold" style={{ fontSize: "3.6cqw", padding: "2cqw 4cqw", background: p.destaque, color: p.fundo }}>
                Chame no WhatsApp
              </span>
            </div>
          </>
        )}

        {layout === "depoimento" && (
          <>
            <Quote className="shrink-0" style={{ width: "13cqw", height: "13cqw", color: p.destaque }} aria-hidden />
            <p className="mt-[3cqw] font-medium italic leading-snug" style={{ fontSize: "5.4cqw", color: p.texto }}>
              Sua melhor avaliação do Google entra aqui, com o nome de quem escreveu.
            </p>
            <div className="mt-[3cqw] flex gap-[1cqw]" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="fill-current" style={{ width: "5cqw", height: "5cqw", color: p.destaque }} />
              ))}
            </div>
            <div className="mt-auto">{assinatura}</div>
          </>
        )}
      </div>
    </div>
  );
}
