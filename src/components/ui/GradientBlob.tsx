import { cn } from "@/lib/utils";

interface GradientBlobProps {
  color?: "amber" | "purple" | "ember";
  size?: string;
  className?: string;
  animate?: boolean;
}

/**
 * THE LAMP — the single permitted gradient on the site, and only in the hero.
 * A static radial wash, no blur filter, no motion. The name and prop signature
 * are preserved because the untouchable chat mounts this component; `purple`
 * and `amber` washes are gone from the design, so those render nothing.
 *
 * `className` is still passed through, but the lamp's geometry and opacity are
 * pinned inline: the chat's call sites carry legacy blob positioning
 * (`-top-60 right-[-10%] opacity-40`) that would displace and erase the wash.
 */
export function GradientBlob({ color = "amber", className }: GradientBlobProps) {
  if (color !== "ember") return null;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        inset: 0,
        opacity: 1,
        background:
          "radial-gradient(58rem 30rem at 50% -6%, var(--signal-glow), transparent 68%)",
      }}
    />
  );
}
