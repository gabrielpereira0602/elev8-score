import { detectarSegmento } from "../src/lib/segmentos";
const casos: [string, string][] = [
  ["Clínica de estética", "estetica"], ["Esteticista", "estetica"], ["Dentista", "odontologia"], ["Clínica odontológica", "odontologia"],
  ["Advogado trabalhista", "advocacia"], ["Escritório de advocacia", "advocacia"], ["Barbearia", "beleza"], ["Bar", "restaurante"],
  ["Bar e restaurante", "restaurante"], ["Salão de beleza", "beleza"], ["Padaria", "restaurante"], ["Cafeteria", "restaurante"],
  ["Pet shop", "pet"], ["Clínica veterinária", "pet"], ["Studio de pilates", "academia"], ["Academia", "academia"],
  ["Loja de roupas", "loja"], ["Ótica", "loja"], ["Escritório de contabilidade", "generico"], ["Oficina mecânica", "generico"],
  ["", "generico"], ["   ", "generico"], ["Competição de dança", "generico"], ["Barão Imóveis", "generico"],
];
let falhas = 0;
for (const [cat, esperado] of casos) {
  const r = detectarSegmento(cat);
  const ok = r === esperado; if (!ok) falhas++;
  console.log(`${ok ? "ok  " : "FALHA"} ${JSON.stringify(cat).padEnd(32)} → ${r}${ok ? "" : ` (esperado ${esperado})`}`);
}
console.log(falhas ? `\n${falhas} falha(s)` : "\nTodos os casos passaram");
if (falhas) process.exit(1);
