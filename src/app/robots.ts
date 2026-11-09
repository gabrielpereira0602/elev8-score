import type { MetadataRoute } from "next";

/** O diagnóstico de cada empresa e o painel administrativo não aparecem no Google. Só a página de entrada é pública. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/painel", "/admin"] } };
}
