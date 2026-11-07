"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Star } from "lucide-react";

type Props = { empresa: string; link: string; cor: string };

/** Prévia da arte da plaquinha. O arquivo final é um PDF que o empresário imprime; não enviamos placa física. */
export function Plaquinha({ empresa, link, cor }: Props) {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(link, { margin: 1, width: 360, color: { dark: "#0b0f19", light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [link]);

  return (
    <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_8px_24px_-12px_rgba(5,7,13,0.3)]">
      <div className="px-5 pb-4 pt-5 text-center text-white" style={{ background: cor }}>
        <div className="flex justify-center gap-0.5" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={16} className="fill-current" />
          ))}
        </div>
        <p className="mt-2 font-display text-[17px] font-extrabold leading-tight">Gostou do atendimento?</p>
        <p className="mt-1 text-[13px] opacity-90">Conte para outras pessoas no Google</p>
      </div>
      <div className="flex flex-col items-center gap-2 px-5 py-4">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt={`QR code para avaliar ${empresa} no Google`} width={150} height={150} className="size-[150px]" />
        ) : (
          <div className="size-[150px] animate-pulse rounded bg-subtle" aria-label="Gerando QR code" />
        )}
        <p className="text-center text-[12px] text-muted">Aponte a câmera do celular</p>
        <p className="font-display text-sm font-bold">{empresa}</p>
      </div>
    </div>
  );
}
