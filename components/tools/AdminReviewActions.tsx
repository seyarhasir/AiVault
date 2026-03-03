"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, ShieldAlert } from "lucide-react";
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
    const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

    return (
        <div className="flex items-center gap-3">
            {/* Approval Confirmation */}
            <Dialog open={isApproveConfirmOpen} onOpenChange={setIsApproveConfirmOpen}>
                <DialogTrigger asChild>
                    <Button
                        disabled={isApproving || isRejecting}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Approve Tool
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] border-none bg-background/95 backdrop-blur-xl shadow-2xl">
                    <DialogHeader className="space-y-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                            <Check className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-center space-y-2">
                            <DialogTitle className="text-2xl font-bold tracking-tight">Confirm Approval</DialogTitle>
                            <DialogDescription className="text-muted-foreground text-pretty">
                                Are you sure you want to approve this tool? It will be immediately visible to all users in the directory.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="mt-6 flex gap-3 sm:gap-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsApproveConfirmOpen(false)}
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={async () => {
                                await handleApprove();
                                setIsApproveConfirmOpen(false);
                            }}
                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                            disabled={isApproving}
                        >
                            {isApproving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Confirm Approval
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rejection Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        disabled={isApproving || isRejecting}
                        className="gap-2 text-destructive hover:bg-destructive/10 transition-all hover:scale-105 active:scale-95"
                    >
                        <X className="w-4 h-4" />
                        Reject Tool
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] border-none bg-background/95 backdrop-blur-xl shadow-2xl">
                    <form onSubmit={handleReject}>
                        <DialogHeader className="space-y-4">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                                <ShieldAlert className="w-6 h-6 text-destructive" />
                            </div>
                            <div className="text-center space-y-2">
                                <DialogTitle className="text-2xl font-bold tracking-tight text-destructive">Reject Submission</DialogTitle>
                                <DialogDescription className="text-muted-foreground text-pretty">
                                    Please provide a detailed reason for the rejection. This will be sent as feedback to the submitter.
                                </DialogDescription>
                            </div>
                        </DialogHeader>
                        <div className="py-6">
                            <Textarea
                                placeholder="e.g. Broken website link, low quality description, or duplicate submission..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                required
                                rows={5}
                                className="resize-none bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-destructive/50 transition-all"
                            />
                        </div>
                        <DialogFooter className="flex gap-3 sm:gap-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1 sm:flex-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={isRejecting}
                                className="flex-1 sm:flex-none shadow-lg shadow-destructive/20"
                            >
                                {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Send Rejection
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
