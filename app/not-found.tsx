import { Button } from "@/components/ui/button";
import { EditorialContainer, PageShell } from "@/components/ui/layout";
import Link from "next/link";

export default function NotFound() {
  return (
    <PageShell className="flex items-center">
      <EditorialContainer className="py-20 text-center">
        <section>
          <p className="rv-kicker mb-6">raw.vives / 404</p>
          <h1 className="rv-page-title mb-7">Página no encontrada</h1>
          <p className="rv-intro mx-auto mb-10">
            La ruta solicitada no existe. The requested page does not exist.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/es">Volver al archivo</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/en">Back to archive</Link>
            </Button>
          </div>
        </section>
      </EditorialContainer>
    </PageShell>
  );
}
