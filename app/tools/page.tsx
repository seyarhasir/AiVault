"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search, Star, Filter, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function ToolsDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";
  
  const [category, setCategory] = useState(initialCategory);
  const [pricing, setPricing] = useState("All");
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("newest");

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    
    const newUrl = `/tools${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [category, search]);

  const tools = useQuery(api.tools.getTools, {
    category: category === "All" ? undefined : category,
    pricing: pricing === "All" ? undefined : pricing,
    search: search || undefined,
    sort,
  });

  const categories = ["All", "Writing", "Image", "Video", "Coding", "Productivity", "Audio", "Design"];
  const pricingOptions = ["All", "Free", "Freemium", "Paid"];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "upvotes", label: "Most Upvoted" }
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Category</label>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === cat 
                        ? "bg-purple-500/20 text-purple-400 font-medium" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Pricing</label>
              <div className="flex flex-col gap-1">
                {pricingOptions.map((price) => (
                  <button
                    key={price}
                    onClick={() => setPricing(price)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      pricing === price 
                        ? "bg-purple-500/20 text-purple-400 font-medium" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search tools, categories, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {!tools ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold mb-2">No tools found</h3>
            <p className="text-gray-400">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setCategory("All"); setPricing("All"); setSearch(""); }}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tools.map((tool: any, i: number) => (
              <motion.div
                key={tool._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
              >
                <Link href={`/tools/${tool.slug}`} className="block group h-full">
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-full hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 relative border border-white/10 shrink-0">
                        {tool.logoUrl ? (
                          <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-purple-500 to-cyan-500">
                            {tool.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {tool.isNew && (
                          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 rounded-full">
                            New
                          </span>
                        )}
                        {tool.featured && (
                          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{tool.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{tool.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {tool.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-white/5 rounded text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>

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
      </main>
    </div>
  );
}
