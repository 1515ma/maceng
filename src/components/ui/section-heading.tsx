"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge: string;
  title: string;
  highlight?: string;
  description: string;
}

export function SectionHeading({ badge, title, highlight, description }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 dark:bg-brand-950/50 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 mb-4">
        {badge}
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
        {title}{" "}
        {highlight && <span className="text-brand-600">{highlight}</span>}
      </h2>
      <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
