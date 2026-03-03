"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "motion/react";
import ToolCard from "@/components/tools/ToolCard";
import ToolCardSkeleton from "@/components/tools/ToolCardSkeleton";

export default function FeaturedTools() {
  const featuredTools = useQuery(api.tools.getFeaturedTools);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-balance text-3xl tracking-tight text-shadow-[0_0px_50px_theme(--color-foreground/.2)] md:text-4xl lg:text-5xl">
            Featured <span className="text-primary">Tools</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-base tracking-wider md:text-lg">
            Hand-picked AI tools recommended by our team
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/tools" className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {!featuredTools ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.slice(0, 6).map((tool: any, i: number) => (
              <motion.div
                key={tool._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
