"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-primary/20 bg-primary/5 p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />

          <h2 className="text-balance text-3xl tracking-tight text-shadow-[0_0px_50px_theme(--color-foreground/.2)] md:text-4xl lg:text-5xl mb-4">
            Have an AI tool <br className="hidden sm:block" /> to <span className="text-primary">share</span>?
          </h2>
          <p className="text-base text-foreground/80 tracking-wider mb-8 max-w-xl mx-auto md:text-lg">
            Submit your favorite AI tool to our directory and help thousands of people discover it. All submissions are reviewed by our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="rounded-md px-8">
              <Link href="/submit">
                Submit a Tool <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-md px-8">
              <Link href="/tools">
                Browse Directory
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
