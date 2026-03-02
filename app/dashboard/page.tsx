"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { userId, isLoaded } = useAuth();

  const bookmarks = useQuery(api.bookmarks.getBookmarks, userId ? { userId } : "skip");
  const submittedTools = useQuery(api.tools.getSubmittedTools, userId ? { userId } : "skip");

  if (!isLoaded) return <div className="p-20 text-center text-muted-foreground">Loading...</div>;

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <h1 className="text-balance text-3xl tracking-tight md:text-4xl">Sign In Required</h1>
        <p className="text-muted-foreground mb-8 tracking-wider">You must be signed in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-balance text-3xl tracking-tight text-shadow-[0_0px_50px_theme(--color-foreground/.2)] md:text-4xl mb-10">Your <span className="text-primary">Dashboard</span></h1>

      <div className="space-y-16">
        {/* Bookmarks Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 tracking-tight">
            <Star className="w-6 h-6 text-primary" /> Saved Tools
          </h2>

          {!bookmarks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookmarks.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">You haven&apos;t saved any tools yet.</p>
                <Link href="/tools" className="text-primary hover:text-primary/80 font-medium">
                  Browse Directory
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((tool: any) => (
                <Link key={tool._id} href={`/tools/${tool.slug}`} className="block group">
                  <Card className="hover:border-primary/50 transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary relative shrink-0">
                        {tool.logoUrl ? (
                          <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-primary text-primary-foreground">
                            {tool.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold group-hover:text-primary transition-colors">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{tool.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Submitted Tools Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 tracking-tight">
            <Clock className="w-6 h-6 text-primary" /> Your Submissions
          </h2>

          {!submittedTools ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : submittedTools.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">You haven&apos;t submitted any tools yet.</p>
                <Link href="/submit" className="text-primary hover:text-primary/80 font-medium">
                  Submit a Tool
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submittedTools.map((tool: any) => (
                <Card key={tool._id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary relative shrink-0">
                      {tool.logoUrl ? (
                        <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold bg-primary text-primary-foreground">
                          {tool.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{tool.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {tool.approved ? (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            <CheckCircle className="w-3 h-3 mr-1" /> Approved
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                            <Clock className="w-3 h-3 mr-1" /> Pending Review
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
