"use client";

import { Separator } from "@/components/ui/separator";
import ToolCard from "@/components/tools/ToolCard";
import { Doc } from "@/convex/_generated/dataModel";

interface RelatedToolsSectionProps {
    relatedTools: Doc<"tools">[] | undefined;
    category: string;
}

export function RelatedToolsSection({ relatedTools, category }: RelatedToolsSectionProps) {
    if (!relatedTools || relatedTools.length === 0) return null;

    return (
        <div className="mt-16">
            <Separator className="mb-10" />
            <h2 className="text-2xl font-bold tracking-tight mb-6">
                More <span className="text-primary">{category}</span> Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTools.map((t) => (
                    <ToolCard key={t._id} tool={t} />
                ))}
            </div>
        </div>
    );
}
