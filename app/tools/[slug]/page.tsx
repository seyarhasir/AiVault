"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, Bookmark, Share2, Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "motion/react";

export default function ToolDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const { userId } = useAuth();
  
  const tool = useQuery(api.tools.getToolBySlug, { slug });
  const isBookmarked = useQuery(api.bookmarks.isBookmarked, 
    tool && userId ? { toolId: tool._id, userId } : "skip"
  );
  
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const upvoteTool = useMutation(api.tools.upvoteTool);
  
  const [copied, setCopied] = useState(false);
  const [upvoted, setUpvoted] = useState(false);

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

  if (tool === undefined) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-white/10 rounded-2xl mb-8" />
          <div className="w-64 h-10 bg-white/10 rounded-lg mb-4" />
          <div className="w-96 h-6 bg-white/10 rounded-lg" />
        </div>
      </div>
    );
  }

  if (tool === null) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
        <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-gray-400 mb-8">The tool you are looking for does not exist or has been removed.</p>
        <Link href="/tools" className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white/10 relative border border-white/10 shrink-0">
            {tool.logoUrl ? (
              <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-purple-500 to-cyan-500">
                {tool.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">{tool.name}</h1>
              {tool.isNew && (
                <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 rounded-full">
                  New
                </span>
              )}
              {tool.featured && (
                <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 rounded-full">
                  Featured
                </span>
              )}
            </div>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {tool.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-3 py-1.5 bg-white/5 rounded-lg text-sm font-medium text-gray-300 border border-white/5">
                {tool.category}
              </span>
              <span className="px-3 py-1.5 bg-white/5 rounded-lg text-sm font-medium text-gray-300 border border-white/5">
                {tool.pricing}
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm font-medium text-gray-300 border border-white/5">
                <Star className="w-4 h-4 fill-current text-yellow-500/50" />
                {tool.upvotes + (upvoted ? 1 : 0)} Upvotes
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a 
                href={tool.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Visit Website <ExternalLink className="w-4 h-4" />
              </a>
              
              <button 
                onClick={handleUpvote}
                disabled={upvoted}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors border ${
                  upvoted 
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-400 cursor-not-allowed" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                }`}
              >
                <Star className={`w-4 h-4 ${upvoted ? "fill-current" : ""}`} />
                {upvoted ? "Upvoted" : "Upvote"}
              </button>

              <button 
                onClick={handleBookmark}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors border ${
                  isBookmarked 
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-400" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                }`}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
              </button>

              <button 
                onClick={handleShare}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
                title="Share"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-xl font-bold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tool.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-gray-400 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
