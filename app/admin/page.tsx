"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { Check, X, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const { userId, isLoaded } = useAuth();
  
  const pendingTools = useQuery(api.tools.getPendingTools);
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

  if (!isLoaded) return <div className="p-20 text-center">Loading...</div>;
  
  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-8">You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/50">
          Admin Mode
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Pending Approvals</h2>
        
        {!pendingTools ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
            ))}
          </div>
        ) : pendingTools.length === 0 ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-10 text-center">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">All caught up!</h3>
            <p className="text-gray-400">There are no pending tools to review.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingTools.map((tool: any) => (
              <div key={tool._id} className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 relative shrink-0">
                  {tool.logoUrl ? (
                    <Image src={tool.logoUrl} alt={tool.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-purple-500 to-cyan-500">
                      {tool.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/10">
                      {tool.category}
                    </span>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/10">
                      {tool.pricing}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-4">
                    <span>Submitted by: {tool.submittedBy}</span>
                    <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                      View Website
                    </a>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => handleApprove(tool._id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium transition-colors border border-green-500/50"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(tool._id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-colors border border-red-500/50"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
