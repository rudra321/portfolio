export function Footer() {
  // Server Component: the year is computed once at build time — no hydration
  // mismatch across a year boundary.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center lg:grid lg:grid-cols-3 lg:items-center lg:gap-0 lg:text-left">
        <div className="flex flex-col items-center gap-1 lg:items-start">
          <span className="font-mono text-[13px] font-medium text-foreground">
            rudra<span className="text-accent">_</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
            &copy; {year}
          </span>
        </div>

        {/* Caret 3 of 3: static. */}
        <p className="font-mono text-[11px] text-text-secondary lg:text-center">
          — end of transcript —
        </p>

        <div className="lg:text-right">
          <a
            href="#hero"
            className="font-mono text-xs text-text-secondary transition-colors hover:text-accent"
          >
            Ask me something ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
