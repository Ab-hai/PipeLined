"use client";

import { motion } from "framer-motion";

const features = [
  "Track applications from Bookmarked → Offer",
  "AI resume scoring against job descriptions",
  "Auto-generated interview questions per role",
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.4,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function FeatureList() {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="text-left space-y-3 text-sm text-neutral-400"
    >
      {features.map((text) => (
        <motion.li key={text} variants={item} className="flex items-start gap-2">
          <span className="text-emerald-400 mt-0.5">✓</span>
          {text}
        </motion.li>
      ))}
    </motion.ul>
  );
}
