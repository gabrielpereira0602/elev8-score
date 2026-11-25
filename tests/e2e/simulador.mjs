// Simulador local de Google Places, Supabase (REST) e checkout da Kiwify, para o teste de ponta a ponta.
// Site em localhost:3102 com KIWIFY_CHECKOUT_URL=http://localhost:4010/kiwify e KIWIFY_WEBHOOK_TOKEN=token-teste.
import http from "node:http";
import { createHmac, randomUUID } from "node:crypto";
const SITE = "http://localhost:3102";
const assinar = (corpo, token) => createHmac("sha1", token).update(corpo).digest("hex");

const db = { diagnosticos: [], descadastros: [] };
const lugar = (id, nome, av, fotos, extra = {}) => ({
  id, displayName: { text: nome }, formattedAddress: `R. Exemplo, ${av} - Centro, Campinas - SP, Brasil`,
  addressComponents: [{ longText: "Campinas", shortText: "Campinas", types: ["administrative_area_level_2"] }, { longText: "São Paulo", shortText: "SP", types: ["administrative_area_level_1"] }],
  location: { latitude: -22.9, longitude: -47.06 }, rating: 4.7, userRatingCount: av, photos: new Array(fotos).fill({}),
  nationalPhoneNumber: "(19) 99999-0000", regularOpeningHours: {}, primaryType: "beauty_salon", primaryTypeDisplayName: { text: "Clínica de estética" }, ...extra,
});
const empresa = lugar("ChIJ_TESTE", "Studio Bem Estar Teste", 41, 8);
const busca = [lugar("ChIJ_A", "Clínica Alfa", 320, 10), lugar("ChIJ_B", "Estética Beta", 150, 10), empresa, lugar("ChIJ_C", "Espaço Gama", 60, 6)];

const corpo = (req) => new Promise((ok) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => ok(b ? JSON.parse(b) : null)); });
const enviar = (res, status, dados) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(dados)); };
const filtro = (url) => Object.fromEntries([...new URL(url, "http://x").searchParams].filter(([k]) => !["select", "order", "limit"].includes(k)).map(([k, v]) => [k, v.replace(/^(eq|gte)\./, "")]));

http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  // Google
  if (u.pathname === "/v1/places:autocomplete") return enviar(res, 200, { suggestions: [{ placePrediction: { placeId: "ChIJ_TESTE", structuredFormat: { mainText: { text: empresa.displayName.text }, secondaryText: { text: "Campinas - SP" } } } }] });
  if (u.pathname.startsWith("/v1/places/")) return enviar(res, 200, empresa);
  if (u.pathname === "/v1/places:searchText") return enviar(res, 200, { places: busca });
  // Kiwify: "paga" na hora, manda um webhook falsificado (deve ser recusado) e o verdadeiro, e volta para o obrigado.
  if (u.pathname === "/kiwify") {
    const pedido = JSON.stringify({ order_id: "ped-1", order_status: "paid", webhook_event_type: "order_approved", Customer: { email: "ana@teste.com" }, TrackingParameters: { sck: u.searchParams.get("sck"), src: u.searchParams.get("src") } });
    const url = `${SITE}/api/webhooks/kiwify?signature=`;
    const falso = await fetch(url + assinar(pedido, "token-errado"), { method: "POST", headers: { "Content-Type": "application/json" }, body: pedido });
    const certo = await fetch(url + assinar(pedido, "token-teste"), { method: "POST", headers: { "Content-Type": "application/json" }, body: pedido });
    res.writeHead(302, { Location: `${SITE}/obrigado?falso=${falso.status}&certo=${certo.status}` });
    return res.end();
  }
  // Supabase REST
  const m = u.pathname.match(/^\/rest\/v1\/(\w+)$/);
  if (m) {
    const t = db[m[1]];
    const f = filtro(req.url);
    const casa = (r) => Object.entries(f).every(([k, v]) => (k === "criado_em" ? r[k] >= v : String(r[k]) === v));
    if (req.method === "POST") {
      const b = await corpo(req);
      const r = { id: randomUUID(), criado_em: new Date().toISOString(), form_kit: {}, plano_feitas: [], pago: false, pago_em: null, pagamento_id: null, etapa: "novo", notas: null, proposta: null, score_vivo: false, parceiro: null, convite: null, ...b };
      t.push(r);
      return enviar(res, 201, [r]);
    }
    if (req.method === "PATCH") {
      const b = await corpo(req);
      const lista = t.filter(casa);
      lista.forEach((r) => Object.assign(r, b));
      return enviar(res, 200, lista);
    }
    return enviar(res, 200, t.filter(casa).slice().reverse());
  }
  enviar(res, 404, { erro: "rota do simulador não existe", url: req.url });
}).listen(4010, () => console.log("simulador na porta 4010"));
