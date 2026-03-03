"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface AdminReviewActionsProps {
    toolId: string;
    isApproving: boolean;
    isRejecting: boolean;
    rejectReason: string;
    setRejectReason: (reason: string) => void;
    handleApprove: () => Promise<void>;
    handleReject: (e: React.FormEvent) => Promise<void>;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
}

export function AdminReviewActions({
    toolId,
    isApproving,
    isRejecting,
    rejectReason,
    setRejectReason,
    handleApprove,
    handleReject,
    isDialogOpen,
    setIsDialogOpen,
}: AdminReviewActionsProps) {
    return (
        <div className="flex items-center gap-3">
            <Button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
                {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Approve Tool
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        disabled={isApproving || isRejecting}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Reject Tool
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleReject}>
                        <DialogHeader>
                            <DialogTitle>Reject Submission</DialogTitle>
                            <DialogDescription>
                                Please provide a reason for the rejection. This will be sent to the submitter.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Textarea
                                placeholder="e.g. Broken link, insufficient description, duplicate entry..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                required
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="destructive" disabled={isRejecting}>
                                {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Confirm Rejection
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
