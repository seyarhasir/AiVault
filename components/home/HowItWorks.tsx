"use client";

import { motion } from "motion/react";
import { Search, Star, Bookmark } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    description: "Explore our curated directory of 40+ AI tools. Filter by category, pricing, or search for exactly what you need.",
  },
  {
    icon: Star,
    title: "Upvote & Review",
    description: "Upvote the tools you love and leave reviews to help the community discover the best AI solutions.",
  },
  {
    icon: Bookmark,
    title: "Save & Organize",
    description: "Bookmark your favorite tools to your personal dashboard. Build your own collection of go-to AI tools.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-balance text-3xl tracking-tight text-shadow-[0_0px_50px_theme(--color-foreground/.2)] md:text-4xl lg:text-5xl">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mt-3 text-base tracking-wider md:text-lg">
            Ai Vault makes it simple to find, compare, and organize the AI tools that matter to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-xs font-bold text-primary mb-2 tracking-widest">STEP {i + 1}</div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed tracking-wider">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
