import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_COMPRA } from "@/lib/real/kiwify";
import { ehUuid } from "@/lib/real/db";

export const metadata = { title: "Obrigado pela compra · Elev8 Score", robots: { index: false } };

/** Página de obrigado da Kiwify: devolve a pessoa ao painel dela. */
export default async function Obrigado() {
  const id = (await cookies()).get(COOKIE_COMPRA)?.value ?? "";
  if (ehUuid(id)) redirect(`/painel?d=${id}&pagamento=ok`);
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Compra recebida. Obrigado!</h1>
      <p className="mt-4 text-muted">
        Assim que a Kiwify confirmar o pagamento, seu kit e o consultor são liberados no painel. Se esta página não abriu o seu painel
        sozinha, responda o e-mail de compra da Kiwify que a gente libera o seu acesso. No Pix e no cartão a confirmação costuma ser rápida; no boleto, pode levar até 3 dias úteis.
      </p>
    </main>
  );
}
