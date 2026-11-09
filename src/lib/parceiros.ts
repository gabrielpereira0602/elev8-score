/*
  Parceiros que distribuem o Elev8 Score.

  Contadores, fornecedores do nicho e associações comerciais já têm centenas de pequenos negócios na carteira.
  Cada parceiro recebe um link próprio (/?parceiro=codigo). Quem entra por ele vê o nome do parceiro na entrada,
  e o lead fica marcado com a origem. O parceiro ganha comissão sobre o kit e sobre o 1º pagamento de serviços.
  Comissões abaixo são hipóteses de partida, para ajustar na conversa com cada parceiro.
*/
import { leads, type Lead } from "./admin-mock";
import { PRODUTO } from "./elev8";

export const COMISSAO = { kit: 0.3, servico: 0.1 };

export type Parceiro = { codigo: string; nome: string; tipo: string; contato: string; desde: string };

export const parceiros: Parceiro[] = [
  { codigo: "contabil-alianca", nome: "Contabilidade Aliança", tipo: "Escritório de contabilidade", contato: "Marina · (19) 99876-1001", desde: "10/2026" },
  { codigo: "distribuidora-beleza", nome: "Distribuidora Beleza Sul", tipo: "Fornecedor de salões e barbearias", contato: "Paulo · (19) 99876-1002", desde: "11/2026" },
  { codigo: "associacao-exemplo", nome: "Associação de Comerciantes (exemplo)", tipo: "Associação comercial", contato: "Secretaria · (19) 3876-1003", desde: "11/2026" },
];

export function parceiroPorCodigo(codigo?: string): Parceiro | undefined {
  return codigo ? parceiros.find((p) => p.codigo === codigo) : undefined;
}

export function resultadoParceiro(p: Parceiro, lista: Lead[] = leads) {
  const deles = lista.filter((l) => l.parceiro === p.codigo);
  const kits = deles.filter((l) => l.comprouKit).length;
  const servicos = deles.reduce((t, l) => t + (l.contrato?.valor ?? 0), 0);
  return {
    leads: deles.length,
    kits,
    clientes: deles.filter((l) => l.etapa === "cliente").length,
    comissao: kits * PRODUTO.preco * COMISSAO.kit + servicos * COMISSAO.servico,
  };
}
