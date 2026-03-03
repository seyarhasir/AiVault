"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Twitter, Github, MessageCircle, Loader2 } from "lucide-react";

interface SubmitLinksProps {
    formData: any;
    setFormData: (data: any) => void;
    isSubmitting: boolean;
    setStep: (step: number) => void;
}

export function SubmitLinks({
    formData,
    setFormData,
    isSubmitting,
    setStep,
}: SubmitLinksProps) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step3">
            <Card className="rounded-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight mb-1">Links & Review</h2>
                        <p className="text-sm text-muted-foreground">Add social links and review your submission.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                                <Twitter className="w-4 h-4" /> Twitter / X URL
                            </label>
                            <Input
                                type="url" value={formData.twitterUrl}
                                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                                <Github className="w-4 h-4" /> GitHub URL
                            </label>
                            <Input
                                type="url" value={formData.githubUrl}
                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" /> Discord URL
                            </label>
                            <Input
                                type="url" value={formData.discordUrl}
                                onChange={(e) => setFormData({ ...formData, discordUrl: e.target.value })}
                                placeholder="https://discord.gg/..."
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Review Summary */}
                    <div>
                        <h3 className="font-semibold tracking-tight mb-3">Submission Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{formData.name}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">{formData.category}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Pricing</span><span className="font-medium">{formData.pricing}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Tags</span><span className="font-medium">{formData.tags.join(", ")}</span></div>
                            {formData.features.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Features</span><span className="font-medium">{formData.features.length} listed</span></div>}
                            {formData.platforms.length > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Platforms</span><span className="font-medium">{formData.platforms.join(", ")}</span></div>}
                        </div>
                    </div>

                    <div className="flex justify-between pt-2">
                        <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                        <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[160px]">
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</>
                            ) : (
                                "Submit Tool"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
