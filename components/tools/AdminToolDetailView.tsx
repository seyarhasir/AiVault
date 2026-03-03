"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Zap, ThumbsUp, ThumbsDown, Twitter, Github, MessageCircle, Calendar, DollarSign, Tag, Check, X } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface AdminToolDetailViewProps {
    tool: Doc<"tools">;
}

export function AdminToolDetailView({ tool }: AdminToolDetailViewProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary relative border border-border shrink-0">
                    {tool.logoUrl ? (
                        <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-primary text-primary-foreground">
                            {tool.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
                        <Badge variant={tool.approved ? "default" : "secondary"}>
                            {tool.approved ? "Approved" : "Pending Review"}
                        </Badge>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">{tool.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Category:</span>
                        <Badge variant="outline">{tool.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Pricing:</span>
                        <span>{tool.pricing} {tool.pricingDetails && `(${tool.pricingDetails})`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Website:</span>
                        <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                            {tool.websiteUrl}
                        </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Submitted:</span>
                        <span>{new Date(tool.createdAt).toLocaleDateString()} by {tool.submittedBy}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 content-start">
                    {tool.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                {tool.longDescription && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Detailed Description</h2>
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{tool.longDescription}</p>
                    </div>
                )}

                {tool.features && tool.features.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Key Features</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {tool.features.map((f, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border">
                                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                    <span className="text-sm">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {tool.pros && tool.pros.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <ThumbsUp className="w-5 h-5 text-green-500" /> Pros
                            </h2>
                            <ul className="space-y-2">
                                {tool.pros.map((p, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">+</span> {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {tool.cons && tool.cons.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <ThumbsDown className="w-5 h-5 text-red-500" /> Cons
                            </h2>
                            <ul className="space-y-2">
                                {tool.cons.map((c, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-red-500 mt-0.5">-</span> {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {(tool.twitterUrl || tool.githubUrl || tool.discordUrl) && (
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Social Links</h2>
                        <div className="flex gap-4">
                            {tool.twitterUrl && <a href={tool.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>}
                            {tool.githubUrl && <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>}
                            {tool.discordUrl && <a href={tool.discordUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><MessageCircle className="w-5 h-5" /></a>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
