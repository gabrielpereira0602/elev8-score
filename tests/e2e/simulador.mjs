// Simulador local de Google Places, Supabase (REST) e Mercado Pago, para o teste de ponta a ponta.
import http from "node:http";
import { randomUUID } from "node:crypto";

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
  // Mercado Pago
  if (u.pathname === "/checkout/preferences") {
    const b = await corpo(req);
    return enviar(res, 200, { id: "pref1", init_point: `${b.back_urls.success}&payment_id=777&status=approved` });
  }
  if (u.pathname === "/v1/payments/777") return enviar(res, 200, { id: 777, status: "approved", external_reference: db.diagnosticos[0]?.id, transaction_amount: 97 });
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
