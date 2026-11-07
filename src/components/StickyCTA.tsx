"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/** Celular, versão grátis: depois que a pessoa rola a tela, o botão de compra fica sempre à mão, acima da navegação. */
export function StickyCTA() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const oferta = document.getElementById("oferta");
    const aoRolar = () => {
      const passouDoTopo = window.scrollY > 420;
      // Some quando a própria oferta está na tela, para não repetir o botão.
      const ofertaNaTela = oferta ? oferta.getBoundingClientRect().top < window.innerHeight - 120 : false;
      setVisivel(passouDoTopo && !ofertaNaTela);
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-[calc(62px+env(safe-area-inset-bottom))] z-10 px-3 pb-2 transition-all duration-300 md:hidden ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-hidden={!visivel}
    >
      <a
        href="#oferta"
        tabIndex={visivel ? 0 : -1}
        className="flex items-center justify-between gap-3 rounded-[14px] bg-night px-4 py-3 text-white shadow-[0_10px_30px_-8px_rgba(5,7,13,0.5)]"
      >
        <span>
          <span className="block whitespace-nowrap text-[12px] text-white/60">Preço de lançamento</span>
          <span className="font-display text-lg font-extrabold">R$ 97</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-brand px-4 py-2.5 text-sm font-semibold">
          Liberar meu kit
          <ArrowRight size={16} aria-hidden />
        </span>
      </a>
    </div>
  );
}
