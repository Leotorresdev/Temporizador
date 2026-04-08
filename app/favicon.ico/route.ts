import { NextResponse } from "next/server";

// Algunos navegadores siguen pidiendo /favicon.ico aunque usemos metadata icons.
// Redirigimos esa ruta al icono existente para evitar el 404.
export function GET(request: Request) {
  return NextResponse.redirect(new URL("/icono.png", request.url), 307);
}
