import { CheckCircle2, Clock, XCircle } from "lucide-react";

/** Mensagem na volta do Mercado Pago. */
export function AvisoPagamento({ aviso, pago }: { aviso?: string; pago: boolean }) {
  if (!aviso) return null;
  const m = pago
    ? { icone: CheckCircle2, cor: "bg-good-soft text-good", texto: "Pagamento confirmado. Seu kit e o consultor estão liberados." }
    : aviso === "pendente" || aviso === "ok"
      ? { icone: Clock, cor: "bg-warn-soft text-warn", texto: "Pagamento em análise. Assim que o Mercado Pago confirmar, o kit libera sozinho. Atualize esta página em alguns minutos." }
      : aviso === "indisponivel"
        ? { icone: XCircle, cor: "bg-bad-soft text-bad", texto: "O pagamento está indisponível neste momento. Tente de novo em alguns minutos." }
        : { icone: XCircle, cor: "bg-bad-soft text-bad", texto: "O pagamento não foi concluído. Você pode tentar de novo quando quiser." };
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 md:px-8" role="status">
      <p className={`flex items-start gap-2.5 rounded-[var(--radius-control)] px-4 py-3 text-sm font-medium ${m.cor}`}>
        <m.icone size={18} className="mt-0.5 shrink-0" aria-hidden />
        {m.texto}
      </p>
    </div>
  );
}
