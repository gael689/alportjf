import type { Metadata } from "next";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { SITE } from "@/lib/site-config";
import { whatsappConsultaGeneral } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con Alport JF por WhatsApp, Instagram, Facebook o mail. Estamos en Puan, Buenos Aires.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">Contacto</h1>
      <p className="mt-2 max-w-2xl text-base text-muted-foreground">
        Escribinos por el medio que prefieras, te respondemos a la brevedad.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Button
            render={
              <a href={whatsappConsultaGeneral()} target="_blank" rel="noopener noreferrer" />
            }
            nativeButton={false}
            size="lg"
            className="h-14 justify-start bg-success text-base text-white hover:bg-success/90"
          >
            <PhoneIcon className="size-5" />
            Escribinos por WhatsApp
          </Button>
          <Button
            render={
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" />
            }
            nativeButton={false}
            size="lg"
            variant="outline"
            className="h-14 justify-start text-base"
          >
            Instagram — {SITE.instagramHandle}
          </Button>
          <Button
            render={<a href={SITE.facebook} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="h-14 justify-start text-base"
          >
            Facebook — {SITE.nombre}
          </Button>

          <div className="mt-2 flex flex-col gap-3 rounded-xl border border-border bg-white p-6">
            <p className="flex items-center gap-2 text-sm text-ink/80">
              <PhoneIcon className="size-4 text-brand" />
              {SITE.telefonoFijo}
            </p>
            <p className="flex items-center gap-2 text-sm text-ink/80">
              <EnvelopeIcon className="size-4 text-brand" />
              {SITE.mail}
            </p>
            <p className="flex items-center gap-2 text-sm text-ink/80">
              <MapPinIcon className="size-4 text-brand" />
              {SITE.direccion}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
            O dejanos tu consulta
          </h2>
          <ContactForm />
          <p className="mt-3 text-xs text-muted-foreground">
            Al enviar, se abre WhatsApp con tu mensaje listo para confirmar el envío.
          </p>
        </div>
      </div>
    </div>
  );
}
