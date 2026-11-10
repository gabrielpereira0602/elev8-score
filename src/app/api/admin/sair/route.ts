import { NextResponse } from "next/server";
import { COOKIE_ADMIN, siteDe } from "@/lib/real/servidor";

export async function POST(req: Request) {
  const r = NextResponse.redirect(new URL("/admin/login", siteDe(req)), 303);
  r.cookies.set(COOKIE_ADMIN, "", { path: "/", maxAge: 0 });
  return r;
}
