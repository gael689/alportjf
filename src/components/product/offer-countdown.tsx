"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ClockIcon } from "@heroicons/react/24/outline";

type Props = {
  ofertaHasta: string;
  className?: string;
};

function formatRestante(diffMs: number): {
  texto: string;
  /** solo el tramo de minutos:segundos lleva fondo destacado */
  esTramoFinal: boolean;
} {
  const unaHora = 60 * 60 * 1000;
  const unDia = 24 * unaHora;

  if (diffMs > unDia) {
    const dias = Math.ceil(diffMs / unDia);
    return { texto: `Termina en ${dias} día${dias > 1 ? "s" : ""}`, esTramoFinal: false };
  }

  if (diffMs > unaHora) {
    const horas = Math.ceil(diffMs / unaHora);
    return { texto: `Caduca en ${horas}hs`, esTramoFinal: false };
  }

  const minutos = Math.floor(diffMs / 60000);
  const segundos = Math.floor((diffMs % 60000) / 1000);
  const mm = String(minutos).padStart(2, "0");
  const ss = String(segundos).padStart(2, "0");
  return { texto: `Caduca en ${mm}:${ss}`, esTramoFinal: true };
}

/** Contador de oferta 100% orientado a la conversión. Se hidrata solo en cliente
 * para evitar desajustes de segundos entre servidor y navegador. */
export function OfferCountdown({ ofertaHasta, className }: Props) {
  const [diffMs, setDiffMs] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(ofertaHasta).getTime();

    function tick() {
      setDiffMs(Math.max(0, target - Date.now()));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [ofertaHasta]);

  if (diffMs === null || diffMs <= 0) return null;

  const { texto, esTramoFinal } = formatRestante(diffMs);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-bold",
        esTramoFinal
          ? "animate-pulse rounded-full bg-offer px-3 py-1.5 text-offer-ink shadow-sm shadow-offer/50 ring-2 ring-offer/30"
          : "text-ink/70",
        className
      )}
    >
      <ClockIcon className="size-4" />
      {texto}
    </span>
  );
}
