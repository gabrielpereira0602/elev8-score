import type { MetadataRoute } from "next";

/*
  Enquanto o Elev8 Score é protótipo (dados de exemplo), nada aparece no Google.
  No lançamento (fase 5), troque para: allow "/" e disallow ["/painel", "/admin"].
  O diagnóstico de cada empresa e o painel administrativo nunca aparecem em buscadores.
*/
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
