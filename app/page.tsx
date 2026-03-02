"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ArrowRight, Star, ExternalLink, Bookmark } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

export default function Home() {
  const featuredTools = useQuery(api.tools.getFeaturedTools);

  const categories = [
    "Writing", "Image", "Video", "Coding", "Productivity", "Audio", "Design"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black -z-10" />
        
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Discover the best <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                AI tools
              </span> for your workflow
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              A curated directory of the most powerful artificial intelligence tools, updated daily. Find exactly what you need to build faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tools" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                Browse Directory <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/submit" className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors border border-white/10">
                Submit a Tool
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4 overflow-x-auto pb-4 sm:pb-0 hide-scrollbar">
          <div className="flex items-center gap-3 min-w-max justify-start sm:justify-center">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/tools?category=${cat}`}
                className="px-6 py-2 rounded-full border border-white/10 bg-black hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Featured Tools</h2>
            <Link href="/tools" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {!featuredTools ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.slice(0, 6).map((tool: any, i: number) => (
                <motion.div
                  key={tool._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={`/tools/${tool.slug}`} className="block group h-full">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-full hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0" />
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 relative border border-white/10">
                          {tool.logoUrl ? (
                            <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-purple-500 to-cyan-500">
                              {tool.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {tool.isNew && (
                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 rounded-full">
                              New
                            </span>
                          )}
                          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 rounded-full">
                            Featured
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{tool.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-6">{tool.description}</p>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium px-2.5 py-1 bg-white/5 rounded-md text-gray-300">
                            {tool.category}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {tool.pricing}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star className="w-4 h-4 fill-current text-yellow-500/50" />
                          <span className="text-sm font-medium">{tool.upvotes}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
