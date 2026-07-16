import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <section className="max-w-2xl space-y-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
          Error 404
        </p>
        <h1 className="font-serif text-5xl font-medium tracking-tight sm:text-7xl">
          Página no encontrada
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
          La ruta solicitada no existe. The requested page does not exist.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/es"
            className="inline-flex min-h-11 w-full items-center justify-center bg-white px-8 text-xs font-black uppercase tracking-[0.2em] text-black sm:w-auto"
          >
            Volver al archivo
          </Link>
          <Link
            href="/en"
            className="inline-flex min-h-11 w-full items-center justify-center border border-white/20 px-8 text-xs font-black uppercase tracking-[0.2em] text-white sm:w-auto"
          >
            Back to archive
          </Link>
        </div>
      </section>
    </main>
  );
}
