"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  ImageIcon,
  Video,
  Code2,
  Zap,
  Music,
  Palette,
} from "lucide-react";

const categories = [
  { name: "Writing", icon: Pencil },
  { name: "Image", icon: ImageIcon },
  { name: "Video", icon: Video },
  { name: "Coding", icon: Code2 },
  { name: "Productivity", icon: Zap },
  { name: "Audio", icon: Music },
  { name: "Design", icon: Palette },
];

export default function CategoryBar() {
  return (
    <section className="py-10 border-y border-border bg-secondary/30">
      <div className="container mx-auto px-4 overflow-x-auto pb-4 sm:pb-0 hide-scrollbar">
        <div className="flex items-center gap-3 min-w-max justify-start sm:justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button key={cat.name} variant="outline" size="sm" asChild className="rounded-md gap-2">
                <Link href={`/tools?category=${cat.name}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
