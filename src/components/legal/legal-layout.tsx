import type { ReactNode } from "react";

import { Container, Heading, Section } from "@/components/ui/section";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Section ground="paper" size="none" className="pt-[clamp(8rem,14vh,11rem)]">
        <Container>
          <p className="label mb-6 text-[color:var(--fg-3)]">{eyebrow}</p>
          <Heading level={1} size="d2" className="max-w-[16ch]">
            {title}
          </Heading>
          <p className="spec mt-6 text-[color:var(--fg-3)]">
            Last updated {updated}
          </p>
        </Container>
      </Section>

      <Section ground="paper" size="md">
        <Container>
          <div className="measure-wide space-y-9 text-[color:var(--fg-2)] [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-[length:var(--text-d4)] [&_h2]:text-[color:var(--fg)] [&_h2:first-child]:mt-0 [&_li]:mb-2 [&_ul]:list-none [&_ul]:space-y-2">
            {children}
          </div>
        </Container>
      </Section>
    </>
  );
}
