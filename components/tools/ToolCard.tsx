"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  tool: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    pricing: string;
    logoUrl?: string;
    upvotes: number;
    tags: string[];
    featured?: boolean;
    isNew?: boolean;
  };
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`} className="block group h-full">
      <Card className="h-full hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0" />
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary relative border border-border shrink-0">
              {tool.logoUrl ? (
                <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-primary text-primary-foreground">
                  {tool.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {tool.isNew && (
                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  New
                </Badge>
              )}
              {tool.featured && (
                <Badge variant="secondary" className="text-[10px] bg-primary/20 text-primary border-primary/30">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{tool.description}</p>

          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tool.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-secondary rounded text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground">
                {tool.category}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {tool.pricing}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="w-4 h-4 fill-current text-primary/50" />
              <span className="text-sm font-medium">{tool.upvotes}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
