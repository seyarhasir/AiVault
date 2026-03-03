"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

export function SubmitSuccess() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Card className="bg-primary/10 border-primary/20 p-10">
                    <CardContent>
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-4 text-primary tracking-tight">Tool Submitted!</h1>
                        <p className="text-muted-foreground tracking-wider">Your tool has been submitted and is pending admin approval. Redirecting to dashboard...</p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
