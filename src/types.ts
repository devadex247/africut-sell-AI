export type Category =
  | "Food & Bakery"
  | "Fashion & Clothing"
  | "Beauty & Skincare"
  | "Hair & Salon"
  | "Electronics & Gadgets"
  | "Home & Furniture"
  | "Services & Freelance"
  | "Thrift & Vintage"
  | "Accessories & Jewelry"
  | "Other";

export type Tone =
  | "Friendly & Relatable"
  | "Premium & Warm"
  | "Urgent & Limited Stock"
  | "Playful & Vibrant"
  | "Professional & Trustworthy";

export type SalesGoal =
  | "Get WhatsApp orders"
  | "Drive Instagram DMs"
  | "Announce new stock / restock"
  | "Book appointments / sessions"
  | "Promote a special discount"
  | "Generate inquiries";

export type Platform = "Instagram Reels" | "TikTok" | "WhatsApp Status";

export interface SalesBrief {
  videoFileName?: string;
  videoPreview?: string;
  videoDuration?: number; // in seconds
  category: string;
  productTitle: string;
  mainBenefit: string;
  salesGoal: string;
  platforms: string[];
  tone: string;
  cta: string;
  location?: string;
  targetAudience?: string;
  priceNote?: string;
}

export interface HookVariant {
  id: string;
  hookNumber: string; // e.g. "Hook 01"
  text: string;
  style: "Curiosity" | "Emotional / Problem" | "Direct Benefit / Offer" | "Story / POV";
  whyItWorks: string;
}

export interface CaptionOverlay {
  id: string;
  startTime: string; // e.g. "00:00"
  endTime: string;   // e.g. "00:06"
  text: string;
  purpose: "Hook / Attention" | "Feature / Detail" | "Social Proof / Value" | "Urgency / Offer" | "Final CTA";
}

export interface PlatformCaption {
  platform: string;
  caption: string;
  hashtags: string[];
  cta: string;
  tips?: string;
}

export interface StyleRecommendation {
  duration: string;         // e.g. "30 seconds"
  pacing: string;           // e.g. "Fast opening → medium product showcase → strong CTA"
  captionStyle: string;     // e.g. "Large, high-contrast captions with punchy phrases"
  visualTreatment: string;  // e.g. "Clean product-focused cuts with close-up texture reveals"
  mood: string;             // e.g. "Premium + warm"
  rationale: string;
}

export interface BestMoment {
  startTime: string; // e.g. "00:10"
  endTime: string;   // e.g. "00:42"
  durationSeconds: number; // e.g. 32
  rationale: string;
  visualCue: string;
}

export interface SalesContentPack {
  id: string;
  brief: SalesBrief;
  bestMoment: BestMoment;
  hooks: HookVariant[];
  captionOverlays: CaptionOverlay[];
  styleRecommendation: StyleRecommendation;
  platformCaptions: PlatformCaption[];
  whatsappStatus: {
    text: string;
    suggestedEmoji: string;
    directOrderPrompt: string;
  };
  hashtags: string[];
  primaryCta: string;
  generatedAt: string;
  aiEngine: string;
}

export interface Project {
  id: string;
  name: string;
  brief: SalesBrief;
  pack: SalesContentPack;
  savedAt: string;
  isFavorite?: boolean;
}

export type AppView = "landing" | "create" | "processing" | "result" | "projects" | "presets";

export interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  stage: "Understand" | "Decide" | "Write" | "Adapt" | "Package";
  durationMs: number;
}
