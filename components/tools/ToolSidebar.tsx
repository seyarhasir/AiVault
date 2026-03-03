"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Star, Bookmark, Check, Share2, Twitter, Github, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

interface ToolSidebarProps {
    tool: Doc<"tools">;
    upvoted: boolean;
    handleUpvote: () => Promise<void>;
    isBookmarked: boolean | undefined;
    handleBookmark: () => Promise<void>;
    handleShare: () => void;
    copied: boolean;
    reviewCount: number;
}

export function ToolSidebar({
    tool,
    upvoted,
    handleUpvote,
    isBookmarked,
    handleBookmark,
    handleShare,
    copied,
    reviewCount,
}: ToolSidebarProps) {
    return (
        <div className="space-y-6">
            {/* Action Card */}
            <Card className="sticky top-24">
                <CardContent className="p-5 space-y-4">
                    <Button asChild className="w-full" size="lg">
                        <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                            Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </Button>

                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            variant={upvoted ? "secondary" : "outline"}
                            onClick={handleUpvote}
                            disabled={upvoted}
                            className={`w-full ${upvoted ? "bg-primary/20 text-primary" : ""}`}
                            size="sm"
                        >
                            <Star className={`w-4 h-4 mr-1 ${upvoted ? "fill-current" : ""}`} />
                            {upvoted ? "Done" : "Upvote"}
                        </Button>
                        <Button
                            variant={isBookmarked ? "secondary" : "outline"}
                            onClick={handleBookmark}
                            className={`w-full ${isBookmarked ? "bg-primary/20 text-primary" : ""}`}
                            size="sm"
                        >
                            <Bookmark className={`w-4 h-4 mr-1 ${isBookmarked ? "fill-current" : ""}`} />
                            Save
                        </Button>
                        <Button variant="outline" onClick={handleShare} size="sm" className="w-full">
                            {copied ? <Check className="w-4 h-4 mr-1 text-primary" /> : <Share2 className="w-4 h-4 mr-1" />}
                            Share
                        </Button>
                    </div>

                    <Separator />

                    {/* Info */}
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Category</span>
                            <Link href={`/tools?category=${tool.category}`} className="text-primary hover:underline font-medium">{tool.category}</Link>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Pricing</span>
                            <span className="font-medium">{tool.pricing}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Upvotes</span>
                            <span className="font-medium">{tool.upvotes + (upvoted ? 1 : 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Reviews</span>
                            <span className="font-medium">{reviewCount}</span>
                        </div>
                        {tool.lastUpdated && (
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Updated</span>
                                <span className="font-medium">{tool.lastUpdated}</span>
                            </div>
                        )}
                    </div>

                    {/* Social Links */}
                    {(tool.twitterUrl || tool.githubUrl || tool.discordUrl) && (
                        <>
                            <Separator />
                            <div className="flex items-center gap-2">
                                {tool.twitterUrl && (
                                    <Button variant="outline" size="icon" asChild>
                                        <a href={tool.twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter">
                                            <Twitter className="w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                                {tool.githubUrl && (
                                    <Button variant="outline" size="icon" asChild>
                                        <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                                {tool.discordUrl && (
                                    <Button variant="outline" size="icon" asChild>
                                        <a href={tool.discordUrl} target="_blank" rel="noopener noreferrer" title="Discord">
                                            <MessageCircle className="w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
