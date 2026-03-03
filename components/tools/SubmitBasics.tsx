"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Upload, X } from "lucide-react";
import Image from "next/image";

const categories = ["Writing", "Image", "Video", "Coding", "Audio", "Design"];
const pricingOptions = ["Free", "Freemium", "Paid"];

interface SubmitBasicsProps {
    formData: any;
    setFormData: (data: any) => void;
    logoInputType: "url" | "upload";
    setLogoInputType: (type: "url" | "upload") => void;
    logoFile: File | null;
    logoPreview: string;
    handleLogoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearLogoFile: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    setStep: (step: number) => void;
    canProceed: boolean;
}

export function SubmitBasics({
    formData,
    setFormData,
    logoInputType,
    setLogoInputType,
    logoFile,
    logoPreview,
    handleLogoFileChange,
    clearLogoFile,
    fileInputRef,
    setStep,
    canProceed,
}: SubmitBasicsProps) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key="step1">
            <Card className="rounded-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight mb-1">Basic Information</h2>
                        <p className="text-sm text-muted-foreground">Tell us about the tool.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Tool Name *</label>
                            <Input
                                required value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. ChatGPT"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Website URL *</label>
                            <Input
                                type="url" required value={formData.websiteUrl}
                                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Logo</label>
                            <p className="text-xs text-muted-foreground mb-2">Upload a logo image or paste a URL. Max 2MB.</p>

                            <div className="flex gap-2 mb-3">
                                <Button
                                    type="button"
                                    variant={logoInputType === "url" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setLogoInputType("url")}
                                    className="gap-2"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    URL
                                </Button>
                                <Button
                                    type="button"
                                    variant={logoInputType === "upload" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setLogoInputType("upload")}
                                    className="gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload
                                </Button>
                            </div>

                            {logoInputType === "url" ? (
                                <Input
                                    type="url"
                                    value={formData.logoUrl}
                                    onChange={(e) => {
                                        setFormData({ ...formData, logoUrl: e.target.value });
                                    }}
                                    placeholder="https://logos.hunter.io/yourdomain.com"
                                />
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleLogoFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full"
                                    >
                                        {logoFile ? logoFile.name : "Choose file..."}
                                    </Button>
                                    {logoFile && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={clearLogoFile}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            )}

                            {(logoPreview || (formData.logoUrl && (formData.logoUrl.startsWith('http://') || formData.logoUrl.startsWith('https://') || formData.logoUrl.startsWith('data:')))) && (
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary border border-border relative">
                                        <Image
                                            src={logoPreview || formData.logoUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            referrerPolicy="no-referrer"
                                            unoptimized={!!logoPreview}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Logo preview</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Short Description *</label>
                            <Textarea
                                required rows={2} value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="A brief one-liner about what this tool does"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Detailed Description</label>
                            <Textarea
                                rows={4} value={formData.longDescription}
                                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                placeholder="A longer explanation of the tool, its capabilities, and what makes it unique..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-card">{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Pricing *</label>
                                <select
                                    value={formData.pricing}
                                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
                                >
                                    {pricingOptions.map((p) => (
                                        <option key={p} value={p} className="bg-card">{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Pricing Details</label>
                            <Input
                                value={formData.pricingDetails}
                                onChange={(e) => setFormData({ ...formData, pricingDetails: e.target.value })}
                                placeholder="e.g. Free tier available. Pro from $20/mo"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="button" onClick={() => setStep(2)} disabled={!canProceed}>
                            Next Step
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
