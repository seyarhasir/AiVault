"use client";

import Link from "next/link";
import { ArrowRight, Pencil, ImageIcon, Video, Code2, Music, Palette } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Writing", icon: Pencil, description: "Content creation, copywriting, and text generation tools", count: "7+ tools" },
  { name: "Image", icon: ImageIcon, description: "Image generation, editing, and enhancement tools", count: "6+ tools" },
  { name: "Video", icon: Video, description: "Video generation, editing, and production tools", count: "5+ tools" },
  { name: "Coding", icon: Code2, description: "Code generation, completion, and development tools", count: "7+ tools" },
  { name: "Audio", icon: Music, description: "Music generation and voice synthesis tools", count: "4+ tools" },
  { name: "Design", icon: Palette, description: "UI/UX design, graphic design, and prototyping tools", count: "3+ tools" },
];

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: string;
  href: string;
}

function GridItem({ icon, title, description, count, href }: GridItemProps) {
  return (
    <li className="list-none">
      <Link href={href} className="block h-full group">
        <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={3}
          />
          <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
            <div className="relative flex flex-1 flex-col justify-between gap-3">
              <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2 group-hover:bg-primary/10 transition-colors">
                {icon}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">{count}</span>
                </div>
                <p className="text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function CategoryShowcase() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-balance text-3xl tracking-tight text-shadow-[0_0px_50px_theme(--color-foreground/.2)] md:text-4xl lg:text-5xl">
            Browse by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-base tracking-wider md:text-lg">
            Find the right AI tool for every use case
          </p>
          <Link href="/tools" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium mt-4">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <GridItem
              key={cat.name}
              icon={<cat.icon className="h-4 w-4 text-primary" />}
              title={cat.name}
              description={cat.description}
              count={cat.count}
              href={`/tools?category=${cat.name}`}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
