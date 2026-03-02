"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "motion/react";
import { Layers, Tag, Users, TrendingUp } from "lucide-react";

const iconMap = [Layers, Tag, Users, TrendingUp];

export default function StatsSection() {
  const stats = useQuery(api.tools.getStats);

  const items = stats
    ? [
        { label: "AI Tools", value: stats.totalTools },
        { label: "Categories", value: stats.totalCategories },
        { label: "Featured", value: stats.totalFeatured },
        { label: "Total Upvotes", value: stats.totalUpvotes.toLocaleString() },
      ]
    : [
        { label: "AI Tools", value: "..." },
        { label: "Categories", value: "..." },
        { label: "Featured", value: "..." },
        { label: "Total Upvotes", value: "..." },
      ];

  return (
    <section className="py-16 px-4 border-y border-border bg-background">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-balance text-3xl tracking-tight text-shadow-[0_0px_50px_theme(--color-foreground/.2)] md:text-4xl">
            Our <span className="text-primary">Numbers</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => {
            const Icon = iconMap[i];
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-1">{item.value}</div>
                <div className="text-sm text-muted-foreground tracking-wider">{item.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
