import { createIntroBootstrapScript } from "@/lib/intro/bootstrap";

export function IntroBootstrapScript() {
  return (
    <script
      id="raw-vives-intro-bootstrap"
      dangerouslySetInnerHTML={{ __html: createIntroBootstrapScript() }}
    />
  );
}
