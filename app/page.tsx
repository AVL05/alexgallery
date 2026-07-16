import { Button } from "@/components/ui/button";
import { Container, PageShell } from "@/components/ui/layout";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RootPage() {
  return (
    <PageShell className="flex items-center">
      <Container className="py-16 sm:py-24">
        <section className="max-w-5xl">
          <p className="rv-kicker mb-7">Visual Archive by Alex Vicente</p>
          <h1 className="rv-display-xl mb-8">raw.vives</h1>
          <p className="rv-intro mb-10">
            Independent photography and visual stories. Valencia, Spain.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/es">
                Entrar en español <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/en">View in English</Link>
            </Button>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
