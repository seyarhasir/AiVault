"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Star, Bookmark, Share2, Check,
  ThumbsUp, ThumbsDown, Globe, Smartphone, Monitor, Code2,
  Chrome, Zap, Twitter, Github, MessageCircle,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ToolCard from "@/components/ToolCard";

const platformIcons: Record<string, React.ReactNode> = {
  Web: <Globe className="w-4 h-4" />,
  iOS: <Smartphone className="w-4 h-4" />,
  Android: <Smartphone className="w-4 h-4" />,
  Desktop: <Monitor className="w-4 h-4" />,
  API: <Code2 className="w-4 h-4" />,
  "Chrome Extension": <Chrome className="w-4 h-4" />,
};

export default function ToolDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const { userId } = useAuth();

  const tool = useQuery(api.tools.getToolBySlug, { slug });
  const isBookmarked = useQuery(api.bookmarks.isBookmarked,
    tool && userId ? { toolId: tool._id, userId } : "skip"
  );
  const reviews = useQuery(api.reviews.getReviews,
    tool ? { toolId: tool._id } : "skip"
  );
  const relatedTools = useQuery(api.tools.getRelatedTools,
    tool ? { category: tool.category, excludeSlug: tool.slug } : "skip"
  );

  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const upvoteTool = useMutation(api.tools.upvoteTool);
  const addReview = useMutation(api.reviews.addReview);

  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpvote = async () => {
    if (!tool || upvoted) return;
    await upvoteTool({ toolId: tool._id });
    setUpvoted(true);
  };

  const handleBookmark = async () => {
    if (!tool || !userId) return;
    await toggleBookmark({ toolId: tool._id, userId });
  };

  const handleSubmitReview = async () => {
    if (!tool || !userId || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await addReview({
        toolId: tool._id,
        userId,
        rating: reviewRating,
        comment: reviewText.trim(),
      });
      setReviewText("");
      setReviewRating(5);
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (tool === undefined) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <Skeleton className="w-32 h-5 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-6">
              <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="w-48 h-8" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-3/4 h-5" />
              </div>
            </div>
            <Skeleton className="w-full h-64 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-48 rounded-2xl" />
            <Skeleton className="w-full h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (tool === null) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
        <h1 className="text-balance text-3xl tracking-tight md:text-4xl">Tool Not Found</h1>
        <p className="text-muted-foreground mb-8 tracking-wider">The tool you are looking for does not exist or has been removed.</p>
        <Link href="/tools" className="text-primary hover:text-primary/80 flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
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
                  <Star className="w-3 h-3 fill-current text-primary" /> {averageRating} ({reviews!.length} reviews)
                </Badge>
              )}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-current text-primary/50" />
                {tool.upvotes + (upvoted ? 1 : 0)} upvotes
              </div>
            </div>

            <Separator />

            {/* Tabs Content */}
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
                      {tool.useCases.map((uc: string, i: number) => (
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
                            {tool.pros.map((p: string, i: number) => (
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
                            {tool.cons.map((c: string, i: number) => (
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
                    {tool.tags.map((tag: string) => (
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
                    {tool.features.map((f: string, i: number) => (
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
          </div>

          {/* Right Sidebar */}
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
                  {reviews && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reviews</span>
                      <span className="font-medium">{reviews.length}</span>
                    </div>
                  )}
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
        </div>

        {/* Related Tools */}
        {relatedTools && relatedTools.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-10" />
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              More <span className="text-primary">{tool.category}</span> Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTools.map((t: any) => (
                <ToolCard key={t._id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
