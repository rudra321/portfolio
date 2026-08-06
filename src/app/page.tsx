import { ChatExperience } from "@/components/ai/ChatExperience";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

// The transcript index at the seam — same questions the sections answer.
const TRANSCRIPT_INDEX = [
  { index: "01", question: "who are you?", href: "#about" },
  { index: "02", question: "where have you worked?", href: "#experience" },
  { index: "03", question: "what do you build on the side?", href: "#projects" },
  { index: "04", question: "what do you work with?", href: "#skills" },
  { index: "05", question: "how do we talk?", href: "#contact" },
] as const;

export default function Home() {
  return (
    <>
      {/* AI-first front door */}
      <ChatExperience />

      {/* Designed handoff seam → crawlable / accessible full portfolio below,
          for skimmers, recruiters, search engines, and no-JS visitors. */}
      <div id="browse" className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-6 py-14">
          {/* Row 1 — the provenance rule, label knocked out of the hairline. */}
          <div className="relative flex justify-center">
            <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-hairline" />
            <span className="relative bg-background px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
              <span className="text-accent">[</span> Prefer to read? The full version{" "}
              <span className="text-accent">]</span>
            </span>
          </div>

          {/* Row 2 — honest labelling of what was written by whom. */}
          <p className="mt-4 text-center font-mono text-[11px] text-text-secondary">
            above: model-generated · below: human-written
          </p>

          {/* Row 3 — transcript index. Plain anchors; Lenis smooths the scroll. */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2">
            {TRANSCRIPT_INDEX.map((entry) => (
              <a
                key={entry.href}
                href={entry.href}
                className="font-mono text-[11px] tracking-[0.02em] text-text-secondary transition-colors hover:text-foreground"
              >
                <span className="text-accent">{entry.index}</span> {entry.question}
              </a>
            ))}
          </div>
        </div>

        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </>
  );
}
