import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

const SIZES = {
  sm: { promo: "text-sm", old: "text-[11px]" },
  md: { promo: "text-xl", old: "text-xs" },
  lg: { promo: "text-4xl", old: "text-base" },
} satisfies Record<string, { promo: string; old: string }>;

/**
 * Precio "gancho" estilo Shein/Temu: precio anterior tachado e inclinado,
 * precio promocional grande justo debajo, para maximizar el contraste de la rebaja.
 */
export function PromoPrice({
  precio,
  precioPromo,
  size = "md",
  className,
}: {
  precio: number;
  precioPromo: number;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn(
          "inline-block w-fit -rotate-6 font-semibold text-brand/60 line-through decoration-2",
          SIZES[size].old
        )}
      >
        {formatPrice(precio)}
      </span>
      <span
        className={cn("font-extrabold leading-tight text-brand", SIZES[size].promo)}
      >
        {formatPrice(precioPromo)}
      </span>
    </div>
  );
}
