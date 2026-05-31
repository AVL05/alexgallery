import Link from "next/link";

export default function RootPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="max-w-3xl space-y-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
          Alex Vicente Visual Archive
        </p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-normal leading-none">
          Archivo visual
        </h1>
        <p className="text-white/65 text-sm md:text-lg leading-relaxed">
          Fotografía, viajes, naturaleza, ciudad, coches y escenas cotidianas
          en una colección visual bilingüe.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/es"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.25em]"
          >
            Entrar en español
          </Link>
          <Link
            href="/en"
            className="w-full sm:w-auto px-8 py-4 border border-white/20 text-xs font-black uppercase tracking-[0.25em] text-white/75 hover:text-white hover:border-white/45 transition-colors"
          >
            View in English
          </Link>
        </div>
      </section>
    </main>
  );
}
