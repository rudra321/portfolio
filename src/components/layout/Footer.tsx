import { PERSONAL } from "@/data/personal";

export function Footer() {
  // Server Component: the year is computed once at build time — no hydration
  // mismatch across a year boundary.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-card-border px-6 pb-8 pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-card-border pb-6 md:flex-row md:items-center md:justify-between">
          <a
            href="#hero"
            className="font-serif text-lg italic text-foreground transition-colors hover:text-accent"
          >
            Ask me something ↑
          </a>
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-text-secondary">
            <a href={`mailto:${PERSONAL.email}`} className="transition-colors hover:text-accent">
              Email
            </a>
            <a
              href={PERSONAL.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={PERSONAL.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <p className="font-mono text-xs text-text-secondary/50">&copy; {year}</p>
          <p className="font-mono text-xs text-text-secondary/50">{PERSONAL.name}</p>
        </div>
      </div>
    </footer>
  );
}
