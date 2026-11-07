import Image from "next/image";
import { ScanSearch, ShieldCheck, Sparkles, Trophy, Gift } from "lucide-react";
import { Entrada } from "@/components/entrada/Entrada";

const gratis = [
  { icone: Trophy, titulo: "Seu Score Digital", texto: "A nota de 0 a 100 da sua empresa, ao lado dos 3 concorrentes mais próximos." },
  { icone: Sparkles, titulo: "O teste das IAs", texto: "Se o ChatGPT e o Gemini indicam você quando alguém pede uma recomendação." },
  { icone: ScanSearch, titulo: "Onde você perde clientes", texto: "Em que etapa o cliente deixa de te encontrar, entender ou escolher." },
  { icone: Gift, titulo: "Uma ação de presente", texto: "A primeira peça do kit pronta para usar hoje mesmo." },
];

export default function Inicio() {
  return (
    <div className="min-h-dvh">
      <section className="bg-night text-white">
        <div className="mx-auto max-w-6xl px-4 pb-40 pt-[max(18px,env(safe-area-inset-top))] md:px-8 md:pb-44">
          <div className="flex items-center gap-2.5 py-1">
            <Image src="/elev8-symbol.png" alt="" width={20} height={29} priority />
            <span className="font-display text-[17px] font-extrabold tracking-tight">
              Elev8 <span className="font-medium text-white/60">Score</span>
            </span>
          </div>

          <div className="mx-auto mt-12 max-w-2xl text-center md:mt-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/75">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden />
              Grátis · resultado em menos de 1 minuto
            </p>
            <h1 className="mt-5 font-display text-[34px] font-extrabold leading-[1.08] tracking-tight text-balance md:text-5xl">
              Seu cliente te encontra, ou encontra o seu concorrente?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Descubra o <b className="font-semibold text-white">Score Digital</b> da sua empresa: a nota de 0 a 100 que mostra o quanto é
              fácil um cliente te encontrar, entender e escolher na internet.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto -mt-32 max-w-6xl px-4 pb-16 md:-mt-36 md:px-8">
        <div className="mx-auto max-w-xl">
          <Entrada />
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[13px] text-muted">
            <ShieldCheck size={15} className="shrink-0 text-good" aria-hidden />
            Usamos apenas dados públicos do Google e das redes. Não pedimos senha de nada.
          </p>
        </div>

        <section aria-labelledby="h-gratis" className="mx-auto mt-14 max-w-4xl">
          <h2 id="h-gratis" className="text-center font-display text-xl font-bold tracking-tight md:text-2xl">
            O que você recebe de graça
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {gratis.map((g) => (
              <li key={g.titulo} className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-brand-soft text-brand">
                  <g.icone size={20} aria-hidden />
                </span>
                <span>
                  <span className="block font-display font-bold">{g.titulo}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted">{g.texto}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-14 border-t border-line pt-6 text-center text-[13px] text-faint">Elev8 Soluções Digitais</footer>
      </main>
    </div>
  );
}
