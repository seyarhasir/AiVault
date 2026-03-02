"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();
  
  const bookmarks = useQuery(api.bookmarks.getBookmarks, userId ? { userId } : "skip");
  const submittedTools = useQuery(api.tools.getSubmittedTools, userId ? { userId } : "skip");

  if (!isLoaded) return <div className="p-20 text-center">Loading...</div>;
  
  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-gray-400 mb-8">You must be signed in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-10">Your Dashboard</h1>

      <div className="space-y-16">
        {/* Bookmarks Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" /> Saved Tools
          </h2>
          
          {!bookmarks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-400 mb-4">You haven&apos;t saved any tools yet.</p>
              <Link href="/tools" className="text-purple-400 hover:text-purple-300 font-medium">
                Browse Directory
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((tool: any) => (
                <Link key={tool._id} href={`/tools/${tool.slug}`} className="block group">
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-purple-500/50 transition-all">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 relative shrink-0">
                      {tool.logoUrl ? (
                        <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-gradient-to-br from-purple-500 to-cyan-500">
                          {tool.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold group-hover:text-purple-400 transition-colors">{tool.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Submitted Tools Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-500" /> Your Submissions
          </h2>
          
          {!submittedTools ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
              ))}
            </div>
          ) : submittedTools.length === 0 ? (
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-400 mb-4">You haven&apos;t submitted any tools yet.</p>
              <Link href="/submit" className="text-purple-400 hover:text-purple-300 font-medium">
                Submit a Tool
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submittedTools.map((tool: any) => (
                <div key={tool._id} className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 relative shrink-0">
                    {tool.logoUrl ? (
                      <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-gradient-to-br from-purple-500 to-cyan-500">
                        {tool.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{tool.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {tool.approved ? (
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
