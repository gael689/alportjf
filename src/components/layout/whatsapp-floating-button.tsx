import { whatsappConsultaGeneral } from "@/lib/whatsapp";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappConsultaGeneral()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-success text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="size-7 fill-current" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.674 4.523 1.84 6.37L4 29l7.82-1.81A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.965 16.845c-.294.826-1.463 1.514-2.396 1.712-.637.132-1.469.238-4.267-.916-3.58-1.483-5.883-5.094-6.063-5.33-.177-.236-1.447-1.925-1.447-3.673 0-1.748.917-2.607 1.243-2.965.294-.32.646-.4.86-.4.214 0 .43.002.617.011.198.01.464-.075.726.554.294.706.995 2.454 1.083 2.633.088.18.147.39.03.626-.118.236-.176.383-.353.59-.177.207-.373.462-.532.62-.177.176-.362.367-.156.72.207.354.918 1.514 1.97 2.451 1.354 1.207 2.495 1.58 2.848 1.757.353.177.559.148.766-.088.206-.236.883-1.03 1.118-1.383.235-.353.47-.294.794-.177.324.118 2.06.972 2.413 1.148.353.177.588.265.677.412.088.147.088.85-.206 1.677Z" />
      </svg>
    </a>
  );
}
