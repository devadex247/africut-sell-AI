import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Video,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Check,
  Film,
  Clock,
  MapPin,
  Tag,
  MessageSquare,
  Instagram,
  Phone,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { SalesBrief } from "../types";
import { KILLER_DEMO_BRIEF } from "../data/presets";

interface CreateFlowProps {
  onSubmit: (brief: SalesBrief) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "Food & Bakery",
  "Fashion & Clothing",
  "Beauty & Skincare",
  "Hair & Salon",
  "Electronics & Gadgets",
  "Home & Furniture",
  "Services & Freelance",
  "Thrift & Vintage",
  "Accessories & Jewelry",
  "Other",
];

const SALES_GOALS = [
  { id: "Get WhatsApp orders", label: "Get WhatsApp orders", desc: "Best for direct messaging sales & custom orders" },
  { id: "Drive Instagram DMs", label: "Drive Instagram DMs", desc: "For impulse fashion & quick inquiries" },
  { id: "Announce new stock / restock", label: "Announce new stock / restock", desc: "Create scarcity & urgency for fresh arrivals" },
  { id: "Book appointments / sessions", label: "Book appointments / sessions", desc: "For service providers, stylists & bakers" },
  { id: "Promote a special discount", label: "Promote a special discount", desc: "For weekend deals & clearance" },
];

const TONES = [
  { id: "Premium & Warm", label: "Premium & Warm", emoji: "✨", desc: "Refined, trustworthy, celebratory" },
  { id: "Friendly & Relatable", label: "Friendly & Relatable", emoji: "👋", desc: "Conversational, neighborly, approachable" },
  { id: "Playful & Vibrant", label: "Playful & Vibrant", emoji: "🔥", desc: "Energetic, trendy, TikTok-ready" },
  { id: "Urgent & Limited Stock", label: "Urgent & Limited Stock", emoji: "⚡", desc: "Scarcity-driven, flash sale" },
  { id: "Professional & Trustworthy", label: "Professional & Trustworthy", emoji: "🛡️", desc: "Clinical, reassuring, expert" },
];

const CTAS = [
  "Send us a WhatsApp message",
  "DM us with your size to order",
  "Tap the link in bio to order",
  "Reply to this status to book",
  "Call now to secure your slot",
];

const SAMPLE_VIDEOS = [
  {
    name: "Chidinma's Cake Decorating (75s)",
    duration: 75,
    category: "Food & Bakery",
    brief: KILLER_DEMO_BRIEF,
  },
  {
    name: "Zola Ankara 2-Piece Try-on (50s)",
    duration: 50,
    category: "Fashion & Clothing",
    brief: {
      videoFileName: "zola-ankara-two-piece-50s.mp4",
      videoDuration: 50,
      category: "Fashion & Clothing",
      productTitle: "Handmade 2-Piece Ankara Co-ord Set",
      mainBenefit: "Breathable 100% African wax cotton, versatile styling for corporate & casual, tailored fit in 4 colorways",
      salesGoal: "Drive Instagram DMs",
      platforms: ["Instagram Reels", "TikTok", "WhatsApp Status"],
      tone: "Playful & Vibrant",
      cta: "DM us to order",
      location: "Lagos / Nationwide Delivery",
      priceNote: "₦18,500 per set",
    },
  },
  {
    name: "Glow Serum Skin Routine (45s)",
    duration: 45,
    category: "Beauty & Skincare",
    brief: {
      videoFileName: "glow-serum-routine-45s.mp4",
      videoDuration: 45,
      category: "Beauty & Skincare",
      productTitle: "Botanical Brightening Glow Serum",
      mainBenefit: "Fades dark spots, hydrates dry melanin skin, all-natural cold-pressed African oils without harsh bleaching",
      salesGoal: "Get WhatsApp orders",
      platforms: ["Instagram Reels", "TikTok", "WhatsApp Status"],
      tone: "Professional & Trustworthy",
      cta: "Send us a WhatsApp message",
      location: "Abuja / Nationwide Delivery",
      priceNote: "₦12,500",
    },
  },
];

export default function CreateFlow({ onSubmit, onCancel }: CreateFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(75);
  const [videoFileName, setVideoFileName] = useState<string>("my-product-video.mp4");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");

  const [category, setCategory] = useState<string>("Food & Bakery");
  const [productTitle, setProductTitle] = useState<string>("");
  const [mainBenefit, setMainBenefit] = useState<string>("");

  const [salesGoal, setSalesGoal] = useState<string>("Get WhatsApp orders");
  const [platforms, setPlatforms] = useState<string[]>([
    "Instagram Reels",
    "TikTok",
    "WhatsApp Status",
  ]);
  const [location, setLocation] = useState<string>("Lagos / Nationwide Delivery");

  const [tone, setTone] = useState<string>("Premium & Warm");
  const [cta, setCta] = useState<string>("Send us a WhatsApp message");
  const [priceNote, setPriceNote] = useState<string>("");

  // Handle Video Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);

      // Extract duration from video element
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.onloadedmetadata = () => {
        const dur = Math.round(tempVideo.duration) || 60;
        setVideoDuration(dur);
      };
      tempVideo.src = url;
    }
  };

  const handleApplyPreset = (presetBrief: SalesBrief) => {
    setVideoFileName(presetBrief.videoFileName || "sample-video.mp4");
    setVideoDuration(presetBrief.videoDuration || 60);
    setCategory(presetBrief.category);
    setProductTitle(presetBrief.productTitle);
    setMainBenefit(presetBrief.mainBenefit);
    setSalesGoal(presetBrief.salesGoal);
    setPlatforms(presetBrief.platforms);
    setTone(presetBrief.tone);
    setCta(presetBrief.cta);
    setLocation(presetBrief.location || "Lagos / Nationwide Delivery");
    setPriceNote(presetBrief.priceNote || "");
  };

  const handlePlatformToggle = (p: string) => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter((item) => item !== p));
      }
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return true; // video or default
    if (currentStep === 2) return productTitle.trim().length > 0;
    if (currentStep === 3) return salesGoal.length > 0 && platforms.length > 0;
    if (currentStep === 4) return tone.length > 0 && cta.length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      const brief: SalesBrief = {
        videoFileName,
        videoPreview: videoPreviewUrl,
        videoDuration,
        category,
        productTitle: productTitle || "Custom Product",
        mainBenefit: mainBenefit || "Handcrafted with premium quality and attention to detail",
        salesGoal,
        platforms,
        tone,
        cta,
        location,
        priceNote,
      };
      onSubmit(brief);
    }
  };

  return (
    <div id="create-flow-container" className="min-h-screen bg-[#FFFBF7] pt-20 sm:pt-24 pb-28 md:pb-16 text-[#1A1A1A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top Header & Wizard Progress */}
        <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#1A1A1A] mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-[#FF6B00] mb-1">
                Step {currentStep} of 4 • Create Social Selling Kit
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A]">
                {currentStep === 1 && "Upload your product video"}
                {currentStep === 2 && "What are you selling?"}
                {currentStep === 3 && "Where & how do you sell?"}
                {currentStep === 4 && "Choose tone & how customers order"}
              </h1>
            </div>

            <div className="text-xs font-bold text-gray-500 bg-[#F8F7F2] border border-[#1A1A1A] px-3 py-1.5 rounded-xl self-start sm:self-center shadow-xs">
              Smart Sales Writer Ready
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#F8F7F2] border border-[#1A1A1A] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#FF6B00] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Step Content */}
        <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1A1A1A]">
          {/* STEP 1: VIDEO UPLOAD & SAMPLES */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  Upload raw phone footage of your product (30 seconds to 3 minutes). You do not need to edit or trim it—Dala AI will identify the best moment.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                />

                {/* Upload Drag & Drop Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1A1A1A] hover:border-[#FF6B00] bg-[#FFFBF7] hover:bg-[#FDF2EB] rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] group-hover:scale-105 flex items-center justify-center mb-3 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="font-black text-base text-[#1A1A1A] mb-1">
                    {videoFile ? videoFileName : "Click or drag your product video here"}
                  </div>
                  <p className="text-xs text-gray-500 max-w-sm font-medium">
                    Supports MP4, MOV, WebM recorded on any phone (30s – 3min recommended).
                  </p>

                  {videoFile && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-[#1DB954] text-white border-2 border-[#1A1A1A] px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_#1A1A1A]">
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>{videoFileName} (~{videoDuration}s) loaded</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Videos Preset Pickers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
                    Or select a preloaded sample video:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SAMPLE_VIDEOS.map((sample, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleApplyPreset(sample.brief)}
                      className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                        videoFileName === sample.brief.videoFileName
                          ? "bg-[#FFFBF7] border-[#FF6B00] shadow-[3px_3px_0px_0px_#FF6B00]"
                          : "bg-[#F8F7F2] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-[#FFD8C2]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 text-[#FF6B00]">
                        <Film className="w-4 h-4" />
                        <span className="text-xs font-black">{sample.category}</span>
                      </div>
                      <div className="text-xs font-black text-[#1A1A1A] line-clamp-1 mb-1">
                        {sample.name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-bold">
                        Duration: {sample.duration}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WHAT ARE YOU SELLING? */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Category Pills */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Product Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                        category === cat
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FF6B00]"
                          : "bg-[#F8F7F2] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#FFD8C2]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Product Title or What You're Selling *
                </label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="e.g. Custom 3-Tier Birthday Cake, Handmade Ankara Two-Piece, Botanical Glow Serum"
                  className="w-full px-4 py-3 text-sm rounded-xl border-2 border-[#1A1A1A] bg-[#FFFBF7] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all font-bold placeholder:font-normal placeholder:text-gray-400"
                />
              </div>

              {/* Main Benefit */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Main Benefit / Special Detail / Selling Point
                </label>
                <textarea
                  rows={3}
                  value={mainBenefit}
                  onChange={(e) => setMainBenefit(e.target.value)}
                  placeholder="e.g. Freshly baked with rich butter and customizable design; or breathable 100% cotton fabric with relaxed fit for all sizes"
                  className="w-full px-4 py-3 text-sm rounded-xl border-2 border-[#1A1A1A] bg-[#FFFBF7] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all font-medium placeholder:font-normal placeholder:text-gray-400 resize-none"
                />
                <p className="text-[11px] text-gray-500 mt-1 font-medium">
                  What makes this special or why should customers choose your product over others?
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SALES GOAL & CHANNELS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Primary Sales Goal */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Primary Sales Goal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SALES_GOALS.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => setSalesGoal(goal.id)}
                      className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all flex items-start justify-between ${
                        salesGoal === goal.id
                          ? "bg-[#FFFBF7] border-[#FF6B00] shadow-[3px_3px_0px_0px_#FF6B00]"
                          : "bg-[#F8F7F2] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-[#FFD8C2]"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black text-[#1A1A1A] mb-0.5">
                          {goal.label}
                        </div>
                        <div className="text-[11px] text-gray-600 leading-tight font-medium">
                          {goal.desc}
                        </div>
                      </div>
                      {salesGoal === goal.id && (
                        <Check className="w-4 h-4 text-[#FF6B00] shrink-0 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Target Social Channels
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Instagram Reels", icon: Instagram },
                    { name: "TikTok", icon: Film },
                    { name: "WhatsApp Status", icon: MessageSquare },
                  ].map(({ name, icon: Icon }) => {
                    const isSelected = platforms.includes(name);
                    return (
                      <div
                        key={name}
                        onClick={() => handlePlatformToggle(name)}
                        className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-[#FFFBF7] border-[#FF6B00] shadow-[3px_3px_0px_0px_#FF6B00]"
                            : "bg-[#F8F7F2] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-[#FFD8C2]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? "text-[#FF6B00]" : "text-[#1A1A1A]"}`} />
                          <span className="text-xs font-black text-[#1A1A1A]">{name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#FF6B00]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Location & Delivery */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Business Location / Delivery Coverage
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lagos, Nigeria / Nationwide Delivery, Nairobi Central"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border-2 border-[#1A1A1A] bg-[#FFFBF7] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all font-bold placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TONE & CALL TO ACTION */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Brand Tone & Voice
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TONES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all flex items-start justify-between ${
                        tone === t.id
                          ? "bg-[#FFFBF7] border-[#FF6B00] shadow-[3px_3px_0px_0px_#FF6B00]"
                          : "bg-[#F8F7F2] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-[#FFD8C2]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#1A1A1A] mb-0.5">
                          <span>{t.emoji}</span>
                          <span>{t.label}</span>
                        </div>
                        <div className="text-[11px] text-gray-600 font-medium">
                          {t.desc}
                        </div>
                      </div>
                      {tone === t.id && (
                        <Check className="w-4 h-4 text-[#FF6B00] shrink-0 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-2">
                  How Customers Should Order
                </label>
                <div className="space-y-2 mb-3">
                  {CTAS.map((c) => (
                    <div
                      key={c}
                      onClick={() => setCta(c)}
                      className={`px-3.5 py-2.5 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                        cta === c
                          ? "bg-[#FFFBF7] border-[#FF6B00] text-[#FF6B00] shadow-[2px_2px_0px_0px_#FF6B00]"
                          : "bg-[#F8F7F2] border-[#1A1A1A] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] hover:bg-[#FFD8C2]"
                      }`}
                    >
                      <span>{c}</span>
                      {cta === c && <Check className="w-4 h-4 text-[#FF6B00]" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price / Urgency Note (Optional) */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Price / Urgency Note (Optional)
                </label>
                <input
                  type="text"
                  value={priceNote}
                  onChange={(e) => setPriceNote(e.target.value)}
                  placeholder="e.g. From ₦35,000 (pre-order required 48hrs ahead), Limited batch of 20 pieces"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-[#1A1A1A] bg-[#FFFBF7] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all font-bold placeholder:font-normal placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-[#F0EBE5]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1.5 text-[#1A1A1A] hover:text-[#FF6B00] text-sm font-black px-4 py-2.5 rounded-xl border-2 border-[#1A1A1A] bg-[#F8F7F2] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-[#FFD8C2] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-500 hover:text-[#1A1A1A] text-sm font-bold px-4 py-2.5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm border-2 transition-all active:scale-98 cursor-pointer ${
                canProceed()
                  ? "bg-[#FF6B00] hover:bg-[#e05e00] text-white border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#1A1A1A]"
                  : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              <span>{currentStep === 4 ? "Generate Social Selling Kit" : "Continue"}</span>
              {currentStep === 4 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
