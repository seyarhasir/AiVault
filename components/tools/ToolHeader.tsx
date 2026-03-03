"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Globe, Smartphone, Monitor, Code2, Chrome, Star } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

const platformIcons: Record<string, React.ReactNode> = {
    Web: <Globe className="w-4 h-4" />,
    iOS: <Smartphone className="w-4 h-4" />,
    Android: <Smartphone className="w-4 h-4" />,
    Desktop: <Monitor className="w-4 h-4" />,
    API: <Code2 className="w-4 h-4" />,
    "Chrome Extension": <Chrome className="w-4 h-4" />,
};

interface ToolHeaderProps {
    tool: Doc<"tools">;
    upvoted: boolean;
    averageRating: string | null;
    reviewCount: number;
}

export function ToolHeader({ tool, upvoted, averageRating, reviewCount }: ToolHeaderProps) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary relative border border-border shrink-0">
                    {tool.logoUrl ? (
                        <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-primary text-primary-foreground">
                            {tool.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{tool.name}</h1>
                        {tool.isNew && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">New</Badge>}
                        {tool.featured && <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">Featured</Badge>}
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed tracking-wider">{tool.description}</p>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">{tool.category}</Badge>
                <Badge variant="outline">{tool.pricing}</Badge>
                {tool.platforms && tool.platforms.map((p: string) => (
                    <Badge key={p} variant="secondary" className="gap-1.5">
                        {platformIcons[p] || <Globe className="w-3 h-3" />} {p}
                    </Badge>
                ))}
                {averageRating && (
                    <Badge variant="secondary" className="gap-1.5">
                        <Star className="w-3 h-3 fill-current text-primary" /> {averageRating} ({reviewCount} reviews)
                    </Badge>
                )}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-current text-primary/50" />
                    {tool.upvotes + (upvoted ? 1 : 0)} upvotes
                </div>
            </div>
        </div>
    );
}
