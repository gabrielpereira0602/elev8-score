import type { Metadata } from "next";
import { LegalPage } from "@/components/Legal";
import { Descadastro } from "./Descadastro";

export const metadata: Metadata = { title: "Parar de receber e-mails · Elev8 Score" };

/** Descadastro em um clique (LGPD). Na fase 4, o link do e-mail traz um código que identifica o contato. */
export default function Pagina() {
  return (
    <LegalPage titulo="Parar de receber e-mails">
      <Descadastro />
    </LegalPage>
  );
}
