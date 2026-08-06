"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import { SectionShell } from "@/components/layout/SectionShell";
import { ledger, typeset } from "@/lib/animations";

export function Projects() {
  // Only my own open-source work lives here; the systems I built for employers
  // are told as employment history in the Experience section.
  const personal = PROJECTS.filter((p) => p.origin === "personal");

  const linkClass =
    "font-mono text-xs text-text-secondary underline decoration-card-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent";

  return (
    <SectionShell
      id="projects"
      index="03"
      slug="projects"
      question="What do I build on the side?"
      wide={
        /* Personal projects — run-log rows aligned to the ledger rail. */
        <motion.div
          variants={ledger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {personal.map((project, idx) => {
            // "Scout — Open-Source Job-Search Agent" splits into the bare name
            // (the heading) and a descriptor that rides above it as an eyebrow.
            const cut = project.title.indexOf(" — ");
            const name = cut === -1 ? project.title : project.title.slice(0, cut);
            const descriptor = cut === -1 ? undefined : project.title.slice(cut + 3);

            return (
              <motion.article
                key={project.id}
                variants={typeset}
                className="group relative border-t border-hairline py-9 last:border-b lg:grid lg:grid-cols-[220px_minmax(0,1fr)_230px] lg:gap-x-10"
              >
                <span
                  aria-hidden
                  className="absolute -left-6 top-0 hidden h-full w-[2px] origin-top scale-y-0 bg-accent transition-transform duration-[250ms] ease-out group-hover:scale-y-100 lg:block"
                />

                <div>
                  <p className="font-mono text-xs font-medium text-accent">
                    P.{String(idx + 1).padStart(2, "0")}
                  </p>
                  {(project.githubUrl || project.liveUrl) && (
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 lg:flex-col">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} — GitHub (opens in new tab)`}
                          className={linkClass}
                        >
                          github <span aria-hidden>↗</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} — live site (opens in new tab)`}
                          className={linkClass}
                        >
                          live <span aria-hidden>↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 lg:mt-0">
                  {descriptor && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                      {descriptor}
                    </p>
                  )}
                  <h3 className="mt-1.5 font-sans text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent">
                    {name}
                  </h3>
                  <p className="mt-3 max-w-[36rem] text-[15px] leading-[1.7] text-text-secondary">
                    {project.description}
                  </p>
                  {/* Below lg the stack rides inline as chips; at lg+ it moves
                      into the third ledger column as a spec list. */}
                  <ul className="mt-5 flex flex-wrap gap-1.5 lg:hidden">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-card-border px-2.5 py-1 font-mono text-[11px] text-text-secondary"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden lg:block">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary/80">
                    stack
                  </p>
                  <ul className="mt-2.5">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border-t border-hairline py-2 font-mono text-[11px] tracking-[0.02em] text-text-secondary last:border-b"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      }
    >
      <motion.p
        variants={typeset}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-xl text-[15px] leading-[1.75] text-text-secondary"
      >
        Work systems live in the answer above. These are mine: open-source, with
        code you can read.
      </motion.p>
    </SectionShell>
  );
}
