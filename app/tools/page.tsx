"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Filter } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ToolCard from "@/components/tools/ToolCard";
import ToolCardSkeleton from "@/components/tools/ToolCardSkeleton";

export default function ToolsDirectory() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <ToolsDirectoryContent />
    </Suspense>
  );
}

function ToolsDirectoryContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState(initialCategory);
  const [pricing, setPricing] = useState("All");
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState("newest");

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
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 tracking-tight">
            <Filter className="w-4 h-4" /> Filters
          </h3>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat
                        ? "bg-primary/20 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Pricing</label>
              <div className="flex flex-col gap-1">
                {pricingOptions.map((price) => (
                  <button
                    key={price}
                    onClick={() => setPricing(price)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${pricing === price
                        ? "bg-primary/20 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools, categories, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 rounded-xl bg-card"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-card border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : tools.length === 0 ? (
          <Card className="text-center py-20">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2 tracking-tight">No tools found</h3>
              <p className="text-muted-foreground mb-4 tracking-wider">Try adjusting your search or filters.</p>
              <Button
                variant="secondary"
                onClick={() => { setCategory("All"); setPricing("All"); setSearch(""); }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tools.map((tool: any, i: number) => (
              <motion.div
                key={tool._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
