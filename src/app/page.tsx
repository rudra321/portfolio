import { ChatExperience } from "@/components/ai/ChatExperience";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      {/* AI-first front door */}
      <ChatExperience />

      {/* Designed handoff seam → crawlable / accessible full portfolio below,
          for skimmers, recruiters, search engines, and no-JS visitors. */}
      <div id="browse" className="border-t border-card-border">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-6 py-12">
          <span aria-hidden className="h-px flex-1 bg-card-border" />
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-text-secondary/80">
            Prefer to read? The full version
          </span>
          <span aria-hidden className="h-px flex-1 bg-card-border" />
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
