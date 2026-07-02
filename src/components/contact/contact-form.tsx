"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/lib/site-config";

export function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const texto = [
      `Hola ${SITE.nombre}! Soy ${nombre || "un cliente"}.`,
      "",
      mensaje,
    ].join("\n");
    const phone = SITE.whatsapp.replace(/\D/g, "");
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="mensaje">Mensaje</Label>
        <textarea
          id="mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Contanos en qué te podemos ayudar…"
          required
          rows={4}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
      <Button type="submit" size="lg" className="bg-success text-white hover:bg-success/90">
        Enviar por WhatsApp
      </Button>
    </form>
  );
}
