"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/layout/SectionShell";
import { PERSONAL } from "@/data/personal";
import { METRICS } from "@/data/stats";
import { ledger, typeset } from "@/lib/animations";

const FACTS = [
  {
    label: "education",
    value: PERSONAL.degree,
    note: `${PERSONAL.university}, ${PERSONAL.campus} · Class of ${PERSONAL.gradYear}`,
  },
  {
    label: "shipping for",
    value: "3+ yrs",
    note: null,
  },
  {
    label: "based in",
    value: "Bangalore",
    note: "India",
  },
  {
    label: "reading",
    value: "Designing Data-Intensive Applications",
    note: "by Martin Kleppmann",
  },
];

export function About() {
  return (
    <SectionShell id="about" index="01" slug="about" question="Who are you?">
      <motion.div
        variants={ledger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.p
          variants={typeset}
          className="font-serif text-[22px] font-normal italic leading-[1.55] text-foreground/90"
        >
          I lead the stack behind a healthcare platform now past{" "}
          <span className="text-foreground">{METRICS.patients} patients</span>: a
          React Native app, an Express backend on Lambda, a Supabase database,
          and the boring glue that keeps all three in agreement.
        </motion.p>

        <motion.p
          variants={typeset}
          className="mt-6 text-[15px] leading-[1.75] text-text-secondary"
        >
          Before Raaz I worked on browser-side ML at GJ-Map, compiling C++
          inference kernels to WebAssembly so an ONNX model could run on a
          government analyst&apos;s laptop without a server round-trip. Before
          that I built a real-time fraud dashboard at SuperPe that cut losses by
          half.
        </motion.p>

        <motion.p
          variants={typeset}
          className="mt-6 text-[15px] leading-[1.75] text-text-secondary"
        >
          Outside work I play Ultimate Frisbee. My team won gold at the{" "}
          <span className="text-foreground">National Open Championship</span> in
          2025 and the National College Championship in 2023, a useful reminder
          that latency matters off-screen too.
        </motion.p>

        <motion.dl
          variants={typeset}
          className="mt-12 grid gap-x-10 sm:grid-cols-2"
        >
          {FACTS.map((fact) => (
            <div key={fact.label} className="border-t border-hairline py-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                {fact.label}
              </dt>
              <dd className="mt-1 text-[15px] font-medium text-foreground">
                {fact.value}
              </dd>
              {fact.note ? (
                <dd className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                  {fact.note}
                </dd>
              ) : null}
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </SectionShell>
  );
}
