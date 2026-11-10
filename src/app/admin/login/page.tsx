import Image from "next/image";

export const metadata = { title: "Entrar · Admin · Elev8 Score" };

const MENSAGENS: Record<string, string> = {
  senha: "Senha incorreta.",
  limite: "Muitas tentativas. Espere 15 minutos.",
  config: "Configure a variável ADMIN_PASSWORD na Hostinger para liberar o admin.",
};

type Props = { searchParams: Promise<{ erro?: string }> };

export default async function Login({ searchParams }: Props) {
  const { erro } = await searchParams;
  return (
    <div className="grid min-h-dvh place-items-center bg-night px-4">
      <form action="/api/admin/login" method="post" className="flex w-full max-w-sm flex-col gap-4 rounded-[var(--radius-card)] bg-surface p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <Image src="/elev8-symbol.png" alt="" width={20} height={29} />
          <p className="font-display text-lg font-extrabold">
            Elev8 Score <span className="font-medium text-muted">· Admin</span>
          </p>
        </div>
        <label htmlFor="senha" className="text-sm font-semibold">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          className="w-full rounded-[var(--radius-control)] border border-line px-4 py-3 text-base outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
        />
        {erro && (
          <p role="alert" className="text-sm text-bad">
            {MENSAGENS[erro] ?? "Não foi possível entrar."}
          </p>
        )}
        <button type="submit" className="rounded-[var(--radius-control)] bg-brand px-5 py-3 text-[15px] font-semibold text-white hover:bg-brand-hover">
          Entrar
        </button>
      </form>
    </div>
  );
}
