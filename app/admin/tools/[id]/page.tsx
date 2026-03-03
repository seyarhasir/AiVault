"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { AdminToolDetailView } from "@/components/tools/AdminToolDetailView";
import { AdminReviewActions } from "@/components/tools/AdminReviewActions";

export default function AdminToolReview() {
  const params = useParams();
  const router = useRouter();
  const toolId = params.id as Id<"tools">;

  const tool = useQuery(api.tools.getToolById, { toolId });
  const approveTool = useMutation(api.tools.approveTool);
  const rejectTool = useMutation(api.tools.rejectTool);

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApprove = async () => {
    if (!tool) return;
    setIsApproving(true);
    try {
      await approveTool({ toolId });

      // Send approval email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'status-update',
            to: tool.submittedBy, // This should be the submitter's email, but we use ID for example
            recipientUserId: tool.submittedBy,
            preferenceKey: 'submissionUpdates',
            data: {
              toolName: tool.name,
              status: 'approved',
              message: 'Your tool is now live in our directory.'
            }
          }),
        });
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
      }

      router.push("/admin");
    } catch (error) {
      console.error("Error approving tool:", error);
      alert("Failed to approve tool.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool || !rejectReason.trim()) return;

    setIsRejecting(true);
    try {
      await rejectTool({ toolId });

      // Send rejection email
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'status-update',
            recipientUserId: tool.submittedBy,
            preferenceKey: 'submissionUpdates',
            data: {
              toolName: tool.name,
              status: 'rejected',
              message: rejectReason.trim()
            }
          }),
        });
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
      }

      setIsDialogOpen(false);
      router.push("/admin");
    } catch (error) {
      console.error("Error rejecting tool:", error);
      alert("Failed to reject tool.");
    } finally {
      setIsRejecting(false);
    }
  };

  if (tool === undefined) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tool === null) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
        <Link href="/admin" className="text-primary hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>

        {/* Action Buttons */}
        {!tool.approved && (
          <AdminReviewActions
            toolId={toolId}
            isApproving={isApproving}
            isRejecting={isRejecting}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            handleApprove={handleApprove}
            handleReject={handleReject}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        )}
      </div>

      <Card>
        <CardContent className="p-8">
          <AdminToolDetailView tool={tool} />
        </CardContent>
      </Card>
    </div>
  );
}
