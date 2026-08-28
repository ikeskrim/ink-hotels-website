import { cn } from "@/lib/utils";

/**
 * The space where a photograph will go.
 *
 * Nine arrangements lost their picture in August 2026: they were stock, and
 * the rule on this site is that a photograph is Rethymno or it is the
 * property. Their cards keep their place in the grid rather than collapsing
 * it — a row of three where one card is suddenly half the height of its
 * neighbours reads as breakage, and this is not breakage. It is an
 * arrangement described in words until the owner's own frame arrives.
 *
 * A hairline rectangle on the lifted ground, and nothing else. Deliberately
 * wordless: a caption would need translating five ways and would point at an
 * absence that is better left quiet. The tokens are ground-aware, so it is
 * correct on paper, shade and ink without being told which it is on.
 *
 * `aria-hidden` because there is nothing here to describe. The heading inside
 * the same link already names the arrangement, and announcing "no image" to a
 * screen reader is noise, not information.
 */
export function NoFrame({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-full w-full border border-[color:var(--hairline)] bg-[color:var(--bg-lift)]",
        className,
      )}
    />
  );
}
