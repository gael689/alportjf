import { BannerForm } from "@/components/admin/banner-form";
import { saveBanner } from "../actions";

export const metadata = {
  title: "Nuevo Banner - Administrar",
};

export default function NuevoBannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Nuevo Banner Promocional</h1>
        <p className="text-sm text-muted-foreground">
          Crea un nuevo banner para el carrusel de inicio.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <BannerForm 
          action={async (formData) => {
            "use server";
            return saveBanner(formData);
          }} 
        />
      </div>
    </div>
  );
}
