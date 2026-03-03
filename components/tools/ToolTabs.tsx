"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Zap, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

interface ToolTabsProps {
    tool: Doc<"tools">;
    reviews: any[] | undefined;
    userId: string | null | undefined;
    reviewText: string;
    setReviewText: (text: string) => void;
    reviewRating: number;
    setReviewRating: (rating: number) => void;
    handleSubmitReview: () => Promise<void>;
    submittingReview: boolean;
}

export function ToolTabs({
    tool,
    reviews,
    userId,
    reviewText,
    setReviewText,
    reviewRating,
    setReviewRating,
    handleSubmitReview,
    submittingReview,
}: ToolTabsProps) {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-6">
                {/* Long Description */}
                {tool.longDescription && (
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight mb-3">About {tool.name}</h2>
                        <p className="text-muted-foreground leading-relaxed tracking-wider whitespace-pre-line">{tool.longDescription}</p>
                    </div>
                )}

                {/* Use Cases */}
                {tool.useCases && tool.useCases.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight mb-3">Use Cases</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {tool.useCases.map((uc, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                                    <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                    <span className="text-sm">{uc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pros & Cons */}
                {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {tool.pros && tool.pros.length > 0 && (
                            <Card>
                                <CardContent className="p-5">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2 tracking-tight">
                                        <ThumbsUp className="w-4 h-4 text-green-500" /> Pros
                                    </h3>
                                    <ul className="space-y-2">
                                        {tool.pros.map((p, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="text-green-500 mt-1 shrink-0">+</span> {p}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                        {tool.cons && tool.cons.length > 0 && (
                            <Card>
                                <CardContent className="p-5">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2 tracking-tight">
                                        <ThumbsDown className="w-4 h-4 text-red-500" /> Cons
                                    </h3>
                                    <ul className="space-y-2">
                                        {tool.cons.map((c, i) => (
                                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="text-red-500 mt-1 shrink-0">-</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Pricing Details */}
                {tool.pricingDetails && (
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight mb-3">Pricing</h2>
                        <p className="text-muted-foreground tracking-wider">{tool.pricingDetails}</p>
                    </div>
                )}

                {/* Tags */}
                <div>
                    <h2 className="text-xl font-semibold tracking-tight mb-3">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {tool.tags.map((tag) => (
                            <Link key={tag} href={`/tools?search=${encodeURIComponent(tag)}`}>
                                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors">
                                    {tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {tool.lastUpdated && (
                    <p className="text-sm text-muted-foreground">Last updated: {tool.lastUpdated}</p>
                )}
            </TabsContent>

            <TabsContent value="features" className="space-y-6 mt-6">
                {tool.features && tool.features.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tool.features.map((f, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-sm">{f}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">No feature details available yet.</p>
                )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 mt-6">
                {/* Write Review */}
                {userId && (
                    <Card>
                        <CardContent className="p-5 space-y-4">
                            <h3 className="font-semibold tracking-tight">Write a Review</h3>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <button key={r} onClick={() => setReviewRating(r)} className="focus:outline-none">
                                        <Star className={`w-5 h-5 transition-colors ${r <= reviewRating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                                    </button>
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">{reviewRating}/5</span>
                            </div>
                            <Textarea
                                placeholder="Share your experience with this tool..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                rows={3}
                            />
                            <Button
                                onClick={handleSubmitReview}
                                disabled={submittingReview || !reviewText.trim()}
                                size="sm"
                            >
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Review List */}
                {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review: any) => (
                            <Card key={review._id}>
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((r) => (
                                                <Star key={r} className={`w-4 h-4 ${r <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">No reviews yet. Be the first to review!</p>
                )}
            </TabsContent>
        </Tabs>
    );
}
