"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const platformOptions = ["Web", "iOS", "Android", "Desktop", "API", "Chrome Extension"];

interface SubmitDetailsProps {
    formData: any;
    setFormData: (data: any) => void;
    tagInput: string;
    setTagInput: (val: string) => void;
    featureInput: string;
    setFeatureInput: (val: string) => void;
    useCaseInput: string;
    setUseCaseInput: (val: string) => void;
    proInput: string;
    setProInput: (val: string) => void;
    conInput: string;
    setConInput: (val: string) => void;
    addToList: (field: any, value: string, setter: (v: string) => void) => void;
    removeFromList: (field: any, index: number) => void;
    togglePlatform: (platform: string) => void;
    setStep: (step: number) => void;
    canProceed: boolean;
}

export function SubmitDetails({
    formData,
    setFormData,
    tagInput,
    setTagInput,
    featureInput,
    setFeatureInput,
    useCaseInput,
    setUseCaseInput,
    proInput,
    setProInput,
    conInput,
    setConInput,
    addToList,
    removeFromList,
    togglePlatform,
    setStep,
    canProceed,
}: SubmitDetailsProps) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step2">
            <Card className="rounded-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight mb-1">Features & Details</h2>
                        <p className="text-sm text-muted-foreground">The more detail, the better the listing.</p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Tags * (at least 1)</label>
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("tags", tagInput, setTagInput); } }}
                                placeholder="Type a tag and press Enter"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => addToList("tags", tagInput, setTagInput)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="gap-1">
                                        {tag}
                                        <button type="button" onClick={() => removeFromList("tags", i)}><X className="w-3 h-3" /></button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Platforms */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Platforms</label>
                        <div className="flex flex-wrap gap-2">
                            {platformOptions.map((p) => (
                                <button
                                    key={p} type="button" onClick={() => togglePlatform(p)}
                                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${formData.platforms.includes(p)
                                            ? "bg-primary/20 text-primary border-primary/30"
                                            : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Key Features</label>
                        <div className="flex gap-2">
                            <Input
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("features", featureInput, setFeatureInput); } }}
                                placeholder="e.g. Real-time collaboration"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => addToList("features", featureInput, setFeatureInput)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {formData.features.length > 0 && (
                            <div className="space-y-1 mt-2">
                                {formData.features.map((f: string, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                                        <span>{f}</span>
                                        <button type="button" onClick={() => removeFromList("features", i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Use Cases */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Use Cases</label>
                        <div className="flex gap-2">
                            <Input
                                value={useCaseInput}
                                onChange={(e) => setUseCaseInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("useCases", useCaseInput, setUseCaseInput); } }}
                                placeholder="e.g. Content writing for blogs"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={() => addToList("useCases", useCaseInput, setUseCaseInput)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {formData.useCases.length > 0 && (
                            <div className="space-y-1 mt-2">
                                {formData.useCases.map((uc: string, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                                        <span>{uc}</span>
                                        <button type="button" onClick={() => removeFromList("useCases", i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Pros</label>
                            <div className="flex gap-2">
                                <Input
                                    value={proInput}
                                    onChange={(e) => setProInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("pros", proInput, setProInput); } }}
                                    placeholder="Add a pro"
                                />
                                <Button type="button" variant="outline" size="icon" onClick={() => addToList("pros", proInput, setProInput)}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            {formData.pros.length > 0 && (
                                <div className="space-y-1 mt-2">
                                    {formData.pros.map((p: string, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                                            <span className="text-green-500 mr-1">+</span> <span className="flex-1">{p}</span>
                                            <button type="button" onClick={() => removeFromList("pros", i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Cons</label>
                            <div className="flex gap-2">
                                <Input
                                    value={conInput}
                                    onChange={(e) => setConInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList("cons", conInput, setConInput); } }}
                                    placeholder="Add a con"
                                />
                                <Button type="button" variant="outline" size="icon" onClick={() => addToList("cons", conInput, setConInput)}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            {formData.cons.length > 0 && (
                                <div className="space-y-1 mt-2">
                                    {formData.cons.map((c: string, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-sm bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                                            <span className="text-red-500 mr-1">-</span> <span className="flex-1">{c}</span>
                                            <button type="button" onClick={() => removeFromList("cons", i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between pt-2">
                        <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                        <Button type="button" onClick={() => setStep(3)} disabled={!canProceed}>Next Step</Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
