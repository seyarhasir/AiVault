"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { Check, X, ShieldAlert, ShieldCheck, Layers, Clock, CheckCircle, TrendingUp, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { isAdmin } from "@/lib/admin";

export default function AdminDashboard() {
  const { userId, isLoaded } = useAuth();

  const pendingTools = useQuery(api.tools.getPendingTools);
  const adminStats = useQuery(api.tools.getAdminStats);
  const approveTool = useMutation(api.tools.approveTool);
  const rejectTool = useMutation(api.tools.rejectTool);

  const handleApprove = async (toolId: any) => {
    if (confirm("Are you sure you want to approve this tool?")) {
      await approveTool({ toolId });
    }
  };

  const handleReject = async (toolId: any) => {
    if (confirm("Are you sure you want to reject and delete this tool?")) {
      await rejectTool({ toolId });
    }
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <Skeleton className="h-10 w-64 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!userId || !isAdmin(userId)) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-6" />
        <h1 className="text-balance text-3xl tracking-tight md:text-4xl">Access Denied</h1>
        <p className="text-muted-foreground mt-4 tracking-wider">
          You must be an administrator to view this page.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          If you are the site owner, add your Clerk user ID to <code className="bg-muted px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_ADMIN_USER_IDS</code> in your <code className="bg-muted px-1.5 py-0.5 rounded text-xs">.env.local</code> file.
        </p>
        {userId && (
          <div className="mt-6">
            <p className="text-xs text-muted-foreground">Your User ID:</p>
            <code className="text-xs bg-muted px-3 py-1.5 rounded-lg mt-1 inline-block select-all">
              {userId}
            </code>
          </div>
        )}
      </div>
    );
  }

  const stats = [
    { label: "Total Tools", value: adminStats?.totalTools ?? "—", icon: Layers, color: "text-primary" },
    { label: "Approved", value: adminStats?.approvedCount ?? "—", icon: CheckCircle, color: "text-green-500" },
    { label: "Pending", value: adminStats?.pendingCount ?? "—", icon: Clock, color: "text-yellow-500" },
    { label: "Categories", value: adminStats?.totalCategories ?? "—", icon: Tag, color: "text-blue-500" },
    { label: "Featured", value: adminStats?.totalFeatured ?? "—", icon: Star, color: "text-amber-500" },
    { label: "Total Upvotes", value: adminStats?.totalUpvotes ?? "—", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-balance text-3xl tracking-tight text-shadow-[0_0px_50px_theme(--color-foreground/.2)] md:text-4xl">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1 tracking-wider text-sm">
            Manage tool submissions and monitor site activity
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-2 gap-2">
          <ShieldCheck className="w-4 h-4" />
          Admin
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-10" />

      {/* Pending Approvals */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-yellow-500" />
            Pending Approvals
          </h2>
          {pendingTools && (
            <Badge variant="secondary" className="text-sm">
              {pendingTools.length} pending
            </Badge>
          )}
        </div>

        {!pendingTools ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 flex gap-6 items-center">
                  <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pendingTools.length === 0 ? (
          <Card className="text-center p-10">
            <CardContent>
              <Check className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 tracking-tight">All caught up!</h3>
              <p className="text-muted-foreground tracking-wider">There are no pending tools to review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingTools.map((tool: any) => (
              <Card key={tool._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Tool Info */}
                    <div className="flex-1 p-6 flex gap-5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary relative shrink-0">
                        {tool.logoUrl ? (
                          <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-primary text-primary-foreground">
                            {tool.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-bold tracking-tight">{tool.name}</h3>
                          <Badge variant="secondary">{tool.category}</Badge>
                          <Badge variant="outline">{tool.pricing}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {tool.tags?.map((tag: string) => (
                            <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Submitted by: <code className="bg-muted px-1 rounded">{tool.submittedBy}</code></span>
                          {tool.websiteUrl && (
                            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Visit Website
                            </a>
                          )}
                          {tool.createdAt && (
                            <span>{new Date(tool.createdAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-0 border-t md:border-t-0 md:border-l border-border shrink-0">
                      <Button
                        onClick={() => handleApprove(tool._id)}
                        variant="ghost"
                        className="flex-1 md:flex-none rounded-none h-full px-6 text-green-600 hover:text-green-700 hover:bg-green-500/10 gap-2"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                      <Separator orientation="vertical" className="md:hidden" />
                      <Separator className="hidden md:block" />
                      <Button
                        onClick={() => handleReject(tool._id)}
                        variant="ghost"
                        className="flex-1 md:flex-none rounded-none h-full px-6 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                      >
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
