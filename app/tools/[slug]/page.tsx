"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { ToolTabs } from "@/components/tools/ToolTabs";
import { ToolSidebar } from "@/components/tools/ToolSidebar";
import { RelatedToolsSection } from "@/components/tools/RelatedToolsSection";

export default function ToolDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const { userId } = useAuth();

  const tool = useQuery(api.tools.getToolBySlug, { slug });
  const isBookmarked = useQuery(api.bookmarks.isBookmarked,
    tool ? { toolId: tool._id } : "skip"
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
    await toggleBookmark({ toolId: tool._id });
  };

  const handleSubmitReview = async () => {
    if (!tool || !userId || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await addReview({
        toolId: tool._id,
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
            <ToolHeader
              tool={tool}
              upvoted={upvoted}
              averageRating={averageRating}
              reviewCount={reviews?.length || 0}
            />

            <Separator />

            <ToolTabs
              tool={tool}
              reviews={reviews}
              userId={userId}
              reviewText={reviewText}
              setReviewText={setReviewText}
              reviewRating={reviewRating}
              setReviewRating={setReviewRating}
              handleSubmitReview={handleSubmitReview}
              submittingReview={submittingReview}
            />
          </div>

          {/* Right Sidebar */}
          <ToolSidebar
            tool={tool}
            upvoted={upvoted}
            handleUpvote={handleUpvote}
            isBookmarked={isBookmarked}
            handleBookmark={handleBookmark}
            handleShare={handleShare}
            copied={copied}
            reviewCount={reviews?.length || 0}
          />
        </div>

        {/* Related Tools */}
        <RelatedToolsSection
          relatedTools={relatedTools}
          category={tool.category}
        />
      </motion.div>
    </div>
  );
}
