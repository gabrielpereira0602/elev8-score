import { notFound } from "next/navigation";
import { AppShell, type Aba } from "@/components/AppShell";
import { TabLocked } from "@/components/BottomStrip";
import { KitView } from "@/components/kit/KitView";
import { KitLocked } from "@/components/kit/KitLocked";
import { Card } from "@/components/ui";
import { diagnostico as d } from "@/lib/mock";

const validas: Aba[] = ["diagnostico", "kit", "plano", "assistente", "elev8"];
const pagas: Aba[] = ["kit", "plano", "assistente"];

type Props = { params: Promise<{ aba: string }>; searchParams: Promise<{ plano?: string }> };

export default async function AbaPage({ params, searchParams }: Props) {
  const { aba } = await params;
  if (!validas.includes(aba as Aba)) notFound();
  const pago = (await searchParams).plano === "pago";
  const bloqueada = pagas.includes(aba as Aba) && !pago;

  let conteudo: React.ReactNode;
  if (aba === "kit") conteudo = pago ? <KitView empresa={d.empresa} /> : <KitLocked empresa={d.empresa} />;
  else if (bloqueada) conteudo = <TabLocked />;
  else
    conteudo = (
      <Card className="mx-auto max-w-md p-8 text-center">
        <h1 className="font-display text-lg font-bold">Em construção</h1>
        <p className="mt-2 text-sm text-muted">Esta aba entra nas próximas etapas.</p>
      </Card>
    );

  return (
    <AppShell ativa={aba as Aba} pago={pago} empresa={d.empresa} cidade={d.cidade}>
      {conteudo}
    </AppShell>
  );
}
