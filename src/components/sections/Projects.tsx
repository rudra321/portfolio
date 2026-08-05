"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import { SectionShell } from "@/components/layout/SectionShell";
import { ledger, typeset } from "@/lib/animations";

/** One-liner for the quieter grid: the description's first sentence. */
function firstSentence(text: string) {
  const [first] = text.split(". ");
  return first.endsWith(".") ? first : `${first}.`;
}

export function Projects() {
  const featured = PROJECTS.filter((p) => p.featured);
  const other = PROJECTS.filter((p) => !p.featured);

  const linkClass =
    "font-mono text-xs text-text-secondary underline decoration-card-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent";

  return (
    <SectionShell
      id="projects"
      index="03"
      slug="projects"
      question="What have you shipped?"
      wide={
        <>
          {/* Featured — run-log rows aligned to the ledger rail. */}
          <motion.div
            variants={ledger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {featured.map((project, idx) => (
              <motion.article
                key={project.id}
                variants={typeset}
                className="group relative border-t border-hairline py-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-x-10"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-accent transition-transform duration-[250ms] ease-out group-hover:scale-y-100"
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

                <div className="mt-5 lg:mt-0">
                  <h3 className="font-sans text-2xl font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-[1.75] text-text-secondary">
                    {project.description}
                  </p>
                  <p className="mt-4 font-mono text-[11px] tracking-[0.02em] text-text-secondary">
                    {project.tags.join(" · ")}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* More — the quieter register. */}
          <motion.div
            className="mt-16"
            variants={typeset}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
              more — {String(other.length).padStart(2, "0")} shipped
            </p>

            <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {other.map((project) => (
                <div
                  key={project.id}
                  className="group border-t border-hairline pt-4"
                >
                  <h3 className="font-sans text-[15px] font-medium text-foreground transition-colors group-hover:text-accent">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} — GitHub (opens in new tab)`}
                      >
                        {project.title}{" "}
                        <span aria-hidden className="text-text-secondary/70">
                          ↗
                        </span>
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                    {firstSentence(project.description)}
                  </p>
                  <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-text-secondary">
                    {project.tags.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      }
    >
      {null}
    </SectionShell>
  );
}
