import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy,
  Check,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  PlusCircle,
  Sparkles,
  Clock,
  Instagram,
  MessageSquare,
  Film,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Info,
  ChevronRight,
  Send,
  ExternalLink,
  Layers,
  Sparkle,
  Edit3,
  Trash2,
  Plus,
  Bot,
  Video,
  Smartphone,
  PhoneCall,
  Save,
} from "lucide-react";
import { SalesContentPack, Project, HookVariant, CaptionOverlay, PlatformCaption } from "../types";
import { quickAiEdit } from "../services/aiService";
import VideoUploadModal from "./VideoUploadModal";

interface ContentPackProps {
  pack: SalesContentPack;
  onSaveProject: (pack: SalesContentPack) => void;
  onUpdatePack?: (updatedPack: SalesContentPack) => void;
  isSaved: boolean;
  onCreateNew: () => void;
  onOpenAiConsultant?: () => void;
  onShowToast?: (message: string, type?: "success" | "sparkle" | "info") => void;
}

export default function ContentPack({
  pack: initialPack,
  onSaveProject,
  onUpdatePack,
  isSaved,
  onCreateNew,
  onOpenAiConsultant,
  onShowToast,
}: ContentPackProps) {
  const [pack, setPack] = useState<SalesContentPack>(initialPack);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<string>(
    initialPack.platformCaptions[0]?.platform || "Instagram Reels"
  );

  // Sync state when props change
  useEffect(() => {
    setPack(initialPack);
  }, [initialPack]);

  // Phone Mockup Simulation State
  const [isPlayingMockup, setIsPlayingMockup] = useState<boolean>(true);
  const [mockupOverlayIndex, setMockupOverlayIndex] = useState<number>(0);

  // Modals & Editing states
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isAiRewritingHooks, setIsAiRewritingHooks] = useState<boolean>(false);
  const [isAiModifyingCaption, setIsAiModifyingCaption] = useState<boolean>(false);
  const [editingHookId, setEditingHookId] = useState<string | null>(null);
  const [editingHookText, setEditingHookText] = useState<string>("");
  const [editingOverlayId, setEditingOverlayId] = useState<string | null>(null);
  const [editingOverlayText, setEditingOverlayText] = useState<string>("");

  // WhatsApp Testing State
  const [merchantWhatsAppNumber, setMerchantWhatsAppNumber] = useState<string>("2348012345678");
  const [isWhatsAppSimulatorOpen, setIsWhatsAppSimulatorOpen] = useState<boolean>(false);

  // Auto cycle overlays in phone mockup preview
  useEffect(() => {
    if (!isPlayingMockup || !pack.captionOverlays.length) return;

    const timer = setInterval(() => {
      setMockupOverlayIndex((prev) => (prev + 1) % pack.captionOverlays.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlayingMockup, pack.captionOverlays.length]);

  const updateCurrentPack = (updated: SalesContentPack) => {
    setPack(updated);
    if (onUpdatePack) {
      onUpdatePack(updated);
    }
  };

  const copyToClipboard = (text: string, key: string, toastLabel?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast?.(toastLabel || "Copied to clipboard! 📋", "success");
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const handleCopyAll = () => {
    const fullText = `
=== AFRICUT SELL: SOCIAL SELLING KIT ===
Product: ${pack.brief.productTitle} (${pack.brief.category})
Sales Goal: ${pack.brief.salesGoal}
Target Channels: ${pack.brief.platforms?.join(", ")}
Location: ${pack.brief.location || "Nationwide Delivery"}

--- A. RECOMMENDED VIDEO MOMENT ---
Highlight Window: ${pack.bestMoment.startTime} - ${pack.bestMoment.endTime} (${pack.bestMoment.durationSeconds}s)
Why this moment: ${pack.bestMoment.rationale}
Visual cue: ${pack.bestMoment.visualCue}

--- B. CATCHY OPENERS (HOOKS) ---
${pack.hooks.map((h) => `${h.hookNumber} (${h.style}): "${h.text}"\nWhy it works: ${h.whyItWorks}`).join("\n\n")}

--- C. TIMED SCREEN WORDS (FOR MUTED VIEWERS) ---
${pack.captionOverlays.map((o) => `[${o.startTime} - ${o.endTime}] ${o.text} (${o.purpose})`).join("\n")}

--- D. RECOMMENDED VIDEO STYLE ---
Duration: ${pack.styleRecommendation.duration}
Pacing: ${pack.styleRecommendation.pacing}
Caption Style: ${pack.styleRecommendation.captionStyle}
Visual: ${pack.styleRecommendation.visualTreatment}
Mood: ${pack.styleRecommendation.mood}

--- E. PLATFORM CAPTIONS ---
${pack.platformCaptions
  .map(
    (p) =>
      `[${p.platform.toUpperCase()}]\n${p.caption}\nOrder Instructions: ${p.cta}\nHashtags: ${p.hashtags.join(" ")}`
  )
  .join("\n\n")}

--- F. WHATSAPP STATUS BROADCAST ---
${pack.whatsappStatus.text}
Direct Order Trigger: "${pack.whatsappStatus.directOrderPrompt}"

--- G. HASHTAGS ---
${pack.hashtags.join(" ")}

--- H. DIRECT ORDER MESSAGE ---
${pack.primaryCta}
`.trim();

    copyToClipboard(fullText, "copy-all", "Copied entire Social Selling Kit! 🚀");
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `africut-selling-kit-${pack.brief.productTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast?.("Downloaded JSON Selling Kit file! 📄", "info");
  };

  // AI Rewriting Actions
  const handleAiGenerateNewHooks = async () => {
    setIsAiRewritingHooks(true);
    onShowToast?.("Dala AI is writing 3 fresh hook variations... ✨", "sparkle");

    const result = await quickAiEdit({
      pack,
      field: "hooks",
      instruction: "Generate 3 fresh, high-converting social commerce hooks with different emotional angles and strong FOMO.",
    });

    if (result && result.hooks && Array.isArray(result.hooks) && result.hooks.length > 0) {
      const updated = { ...pack, hooks: result.hooks };
      updateCurrentPack(updated);
      onShowToast?.("Generated 3 brand new hooks with Dala AI! 🔥", "sparkle");
    } else {
      // Fallback local fresh hooks
      const freshHooks: HookVariant[] = [
        {
          id: "hook-fresh-1",
          hookNumber: "Hook 01 (Urgent)",
          text: `Stop scrolling if you want ${pack.brief.productTitle} that actually looks 10x better in person.`,
          style: "Emotional / Problem",
          whyItWorks: "Directly overcomes fear of receiving low quality compared to photos.",
        },
        {
          id: "hook-fresh-2",
          hookNumber: "Hook 02 (Curiosity)",
          text: `POV: You found the exact ${pack.brief.productTitle} that was sold out all week!`,
          style: "Curiosity",
          whyItWorks: "Triggers instant scarcity and social proof.",
        },
        {
          id: "hook-fresh-3",
          hookNumber: "Hook 03 (Direct)",
          text: `Crafted for quality. Hand-finished details. Ready for dispatch today!`,
          style: "Direct Benefit / Offer",
          whyItWorks: "Rhythmic product promise with zero fluff.",
        },
      ];
      const updated = { ...pack, hooks: freshHooks };
      updateCurrentPack(updated);
      onShowToast?.("Updated with 3 high-impact hooks! ✨", "sparkle");
    }
    setIsAiRewritingHooks(false);
  };

  const handleAiModifyCaption = async (instruction: string, label: string) => {
    setIsAiModifyingCaption(true);
    onShowToast?.(`Applying "${label}" with Dala AI... ✨`, "sparkle");

    const result = await quickAiEdit({
      pack,
      field: "captions",
      instruction: `Rewrite the ${activePlatformTab} caption to: ${instruction}`,
    });

    if (result && result.platformCaptions && Array.isArray(result.platformCaptions)) {
      const updated = { ...pack, platformCaptions: result.platformCaptions };
      updateCurrentPack(updated);
      onShowToast?.(`Updated ${activePlatformTab} caption! ✍️`, "sparkle");
    } else {
      // Local transform fallback
      const currentCaptionObj = pack.platformCaptions.find((p) => p.platform === activePlatformTab);
      if (currentCaptionObj) {
        let modified = currentCaptionObj.caption;
        if (instruction.includes("Pidgin") || instruction.includes("Naija")) {
          modified = `No be small thing oh! 🔥 If you want quality ${pack.brief.productTitle}, this na confirmed deal!\n\n${pack.brief.mainBenefit}.\n\n📍 Nationwide delivery sharp sharp!\n⚡ Limited stock left for this batch!\n\n👉 Send WhatsApp message to lock your order now!`;
        } else if (instruction.includes("Urgency")) {
          modified = `⚡ LIMITED STOCK ALERT: ${pack.brief.productTitle.toUpperCase()} ⚡\n\nOnly a few pieces remaining in this batch! ${pack.brief.mainBenefit}.\n\n👉 Click WhatsApp link or DM immediately to claim yours before it's gone!`;
        } else if (instruction.includes("Shorten")) {
          modified = `✨ ${pack.brief.productTitle} is officially restocked! ${pack.brief.mainBenefit}. WhatsApp us or DM to order today! 💬`;
        } else {
          modified = `Premium ${pack.brief.productTitle}. Handcrafted with care. ${pack.brief.mainBenefit}. Contact our team via WhatsApp to place your custom order today.`;
        }

        const updatedCaptions = pack.platformCaptions.map((p) =>
          p.platform === activePlatformTab ? { ...p, caption: modified } : p
        );
        const updated = { ...pack, platformCaptions: updatedCaptions };
        updateCurrentPack(updated);
        onShowToast?.(`Applied ${label} to ${activePlatformTab}! ✍️`, "sparkle");
      }
    }
    setIsAiModifyingCaption(false);
  };

  const handleSaveHookEdit = (hookId: string) => {
    if (!editingHookText.trim()) return;
    const updatedHooks = pack.hooks.map((h) =>
      h.id === hookId ? { ...h, text: editingHookText.trim() } : h
    );
    const updated = { ...pack, hooks: updatedHooks };
    updateCurrentPack(updated);
    setEditingHookId(null);
    onShowToast?.("Hook text updated! ✍️", "success");
  };

  const handleAddCustomHook = () => {
    const newHook: HookVariant = {
      id: "hook-custom-" + Date.now(),
      hookNumber: `Hook 0${pack.hooks.length + 1}`,
      text: `Your ${pack.brief.productTitle} is finally here. Don't settle for ordinary quality!`,
      style: "Direct Benefit / Offer",
      whyItWorks: "Custom seller-authored attention hook.",
    };
    const updated = { ...pack, hooks: [...pack.hooks, newHook] };
    updateCurrentPack(updated);
    onShowToast?.("Added new custom hook! ✍️", "success");
  };

  const handleDeleteHook = (hookId: string) => {
    if (pack.hooks.length <= 1) {
      onShowToast?.("Keep at least one hook in your kit.", "info");
      return;
    }
    const updatedHooks = pack.hooks.filter((h) => h.id !== hookId);
    const updated = { ...pack, hooks: updatedHooks };
    updateCurrentPack(updated);
    onShowToast?.("Removed hook from kit.", "info");
  };

  // Timed Caption Overlay Actions
  const handleSaveOverlayEdit = (overlayId: string) => {
    if (!editingOverlayText.trim()) return;
    const updatedOverlays = pack.captionOverlays.map((o) =>
      o.id === overlayId ? { ...o, text: editingOverlayText.trim() } : o
    );
    const updated = { ...pack, captionOverlays: updatedOverlays };
    updateCurrentPack(updated);
    setEditingOverlayId(null);
    onShowToast?.("Overlay text updated! ✍️", "success");
  };

  const handleAddOverlay = () => {
    const lastOverlay = pack.captionOverlays[pack.captionOverlays.length - 1];
    const newOverlay: CaptionOverlay = {
      id: "ov-custom-" + Date.now(),
      startTime: lastOverlay ? lastOverlay.endTime : "00:30",
      endTime: "00:40",
      text: `${pack.brief.cta} 👉 Link in bio`,
      purpose: "Final CTA",
    };
    const updated = { ...pack, captionOverlays: [...pack.captionOverlays, newOverlay] };
    updateCurrentPack(updated);
    onShowToast?.("Added new timed screen word! ✍️", "success");
  };

  const handleDeleteOverlay = (overlayId: string) => {
    if (pack.captionOverlays.length <= 1) return;
    const updatedOverlays = pack.captionOverlays.filter((o) => o.id !== overlayId);
    const updated = { ...pack, captionOverlays: updatedOverlays };
    updateCurrentPack(updated);
    onShowToast?.("Removed timed overlay.", "info");
  };

  // Real WhatsApp Launch
  const handleOpenRealWhatsApp = () => {
    const rawNumber = merchantWhatsAppNumber.replace(/[^0-9]/g, "");
    const message = pack.whatsappStatus.directOrderPrompt || `Hello! I want to order ${pack.brief.productTitle}.`;
    const encoded = encodeURIComponent(message);
    const url = rawNumber ? `https://wa.me/${rawNumber}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
    onShowToast?.("Opened real WhatsApp test link! 💬", "success");
  };

  const handleUpdateVideoData = (data: {
    fileName: string;
    previewUrl: string;
    duration: number;
    startSeconds: number;
    endSeconds: number;
  }) => {
    const updated: SalesContentPack = {
      ...pack,
      brief: {
        ...pack.brief,
        videoFileName: data.fileName,
        videoPreview: data.previewUrl,
        videoDuration: data.duration,
      },
      bestMoment: {
        ...pack.bestMoment,
        startTime: `${Math.floor(data.startSeconds / 60) < 10 ? "0" : ""}${Math.floor(data.startSeconds / 60)}:${data.startSeconds % 60 < 10 ? "0" : ""}${data.startSeconds % 60}`,
        endTime: `${Math.floor(data.endSeconds / 60) < 10 ? "0" : ""}${Math.floor(data.endSeconds / 60)}:${data.endSeconds % 60 < 10 ? "0" : ""}${data.endSeconds % 60}`,
        durationSeconds: Math.max(1, data.endSeconds - data.startSeconds),
      },
    };
    updateCurrentPack(updated);
    onShowToast?.("Video attached and highlight moment updated! 📹", "sparkle");
  };

  const activePlatformData =
    pack.platformCaptions.find((p) => p.platform === activePlatformTab) ||
    pack.platformCaptions[0];

  return (
    <div id="content-pack-view" className="min-h-screen bg-[#FFFBF7] pt-20 sm:pt-24 pb-28 md:pb-16 text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Sticky Action Banner */}
        <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-5 sm:p-7 shadow-[4px_4px_0px_0px_#1A1A1A] mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider bg-[#FDF2EB] text-[#FF6B00] border border-[#FFD8C2] px-2.5 py-0.5 rounded-lg">
                  {pack.brief.category}
                </span>
                <span className="text-xs text-gray-500 font-bold">
                  {pack.aiEngine}
                </span>
                <span className="text-xs bg-[#1DB954] text-white border-2 border-[#1A1A1A] px-2.5 py-0.5 rounded-lg font-black shadow-[2px_2px_0px_0px_#1A1A1A]">
                  ✓ 100% Active & Editable
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                {pack.brief.productTitle}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl font-medium">
                Goal: <strong className="text-[#1A1A1A] font-bold">{pack.brief.salesGoal}</strong> • Location: <strong className="text-[#1A1A1A] font-bold">{pack.brief.location || "Lagos / Nationwide"}</strong>
              </p>
            </div>

            {/* Global Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="btn-copy-all"
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all cursor-pointer"
              >
                {copiedKey === "copy-all" ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied Kit!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </>
                )}
              </button>

              <button
                id="btn-save-project"
                onClick={() => onSaveProject(pack)}
                className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border-2 border-[#1A1A1A] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] ${
                  isSaved
                    ? "bg-[#1DB954] text-white"
                    : "bg-[#F8F7F2] hover:bg-[#FFD8C2] text-[#1A1A1A]"
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-white" />
                    <span>Saved in Kits</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save to Kits</span>
                  </>
                )}
              </button>

              {onOpenAiConsultant && (
                <button
                  onClick={onOpenAiConsultant}
                  className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FF6B00] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                  <span>Ask Dala AI</span>
                </button>
              )}

              <button
                id="btn-download-pack"
                onClick={handleDownloadTxt}
                className="flex items-center gap-1.5 bg-[#F8F7F2] hover:bg-[#FFD8C2] text-[#1A1A1A] text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer"
                title="Download JSON Content Pack"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                id="btn-create-another"
                onClick={onCreateNew}
                className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-[#1A1A1A] text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Pack Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Core Content Modules (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* SECTION A: RECOMMENDED VIDEO HIGHLIGHT */}
            <div id="section-best-moment" className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#1A1A1A]">
                    A
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                    Recommended Video Moment
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#FFF3E8] hover:bg-[#FFD8C2] text-[#FF6B00] border border-[#FF6B00] px-3 py-1 rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{pack.brief.videoPreview ? "Replace Video" : "Attach Real Video"}</span>
                  </button>
                  <span className="text-xs font-mono font-black bg-[#FDF2EB] text-[#FF6B00] border-2 border-[#1A1A1A] px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
                    {pack.bestMoment.durationSeconds}s Window
                  </span>
                </div>
              </div>

              {/* Video Player Preview if uploaded */}
              {pack.brief.videoPreview && (
                <div className="mb-4 rounded-2xl overflow-hidden border-2 border-[#1A1A1A] bg-black shadow-[3px_3px_0px_0px_#1A1A1A]">
                  <video
                    src={pack.brief.videoPreview}
                    controls
                    className="w-full max-h-56 object-contain"
                  />
                </div>
              )}

              {/* Visual Highlight Timeline Bar */}
              <div className="bg-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A] p-5 text-white mb-4 shadow-[3px_3px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between text-xs font-mono text-gray-300 mb-2 font-bold">
                  <span>00:00 (Start)</span>
                  <span className="text-[#FF6B00] font-black">
                    {pack.bestMoment.startTime} – {pack.bestMoment.endTime}
                  </span>
                  <span>
                    01:{pack.brief.videoDuration ? (pack.brief.videoDuration - 60 < 10 ? `0${pack.brief.videoDuration - 60}` : pack.brief.videoDuration - 60) : "15"}
                  </span>
                </div>

                {/* Simulated Timeline Bar */}
                <div className="relative h-7 bg-zinc-800 rounded-xl border border-white/20 overflow-hidden flex items-center">
                  <div className="w-[18%] h-full bg-zinc-700/60" />
                  <div className="w-[52%] h-full bg-[#FF6B00] flex items-center justify-center font-mono text-[10px] font-black text-white shadow-inner">
                    Optimal Sales Window ({pack.bestMoment.startTime} - {pack.bestMoment.endTime})
                  </div>
                  <div className="w-[30%] h-full bg-zinc-700/60" />
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-gray-300">
                  <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-white font-bold">Visual Cue:</strong> {pack.bestMoment.visualCue}
                  </p>
                </div>
              </div>

              <div className="bg-[#FFFBF7] border-2 border-[#1A1A1A] rounded-xl p-3.5 text-xs text-[#1A1A1A]">
                <strong className="font-black text-[#FF6B00]">Why this window:</strong> {pack.bestMoment.rationale}
              </div>
            </div>

            {/* SECTION B: HOOK ALTERNATIVES WITH AI REWRITE & INLINE EDITING */}
            <div id="section-hooks" className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#1A1A1A]">
                    B
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                    Hook Alternatives ({pack.hooks.length})
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAiGenerateNewHooks}
                    disabled={isAiRewritingHooks}
                    className="flex items-center gap-1 bg-[#1A1A1A] hover:bg-black text-white text-xs font-black px-3 py-1.5 rounded-xl border border-[#1A1A1A] shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>{isAiRewritingHooks ? "Writing..." : "AI 3 New Hooks"}</span>
                  </button>
                  <button
                    onClick={handleAddCustomHook}
                    className="flex items-center gap-1 bg-[#F8F7F2] hover:bg-[#FFD8C2] text-[#1A1A1A] text-xs font-bold px-2.5 py-1.5 rounded-xl border border-[#1A1A1A] cursor-pointer"
                    title="Add custom hook"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3.5">
                {pack.hooks.map((hook, index) => (
                  <div
                    key={hook.id || index}
                    className="group bg-[#F8F7F2] hover:bg-[#FFFBF7] rounded-2xl border-2 border-[#1A1A1A] p-4 transition-all shadow-[2px_2px_0px_0px_#1A1A1A]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#FF6B00] tracking-wider">
                          {hook.hookNumber}
                        </span>
                        <span className="text-[11px] font-black bg-white text-[#1A1A1A] border border-[#1A1A1A] px-2 py-0.5 rounded-lg">
                          {hook.style}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {editingHookId === hook.id ? (
                          <button
                            onClick={() => handleSaveHookEdit(hook.id)}
                            className="flex items-center gap-1 text-xs font-black text-white bg-[#1DB954] hover:bg-[#179443] px-2.5 py-1 rounded-lg border border-[#1A1A1A] cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingHookId(hook.id);
                              setEditingHookText(hook.text);
                            }}
                            className="p-1 text-gray-500 hover:text-[#1A1A1A] bg-white rounded-lg border border-gray-300 hover:border-[#1A1A1A] cursor-pointer"
                            title="Edit hook text"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => copyToClipboard(hook.text, `hook-${index}`, `Copied ${hook.hookNumber}!`)}
                          className="flex items-center gap-1 text-xs font-bold text-[#1A1A1A] hover:text-[#FF6B00] bg-white hover:bg-[#FFD8C2] px-2.5 py-1 rounded-lg border border-[#1A1A1A] transition-all cursor-pointer"
                        >
                          {copiedKey === `hook-${index}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#1DB954]" />
                              <span className="text-[#1DB954]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteHook(hook.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                          title="Delete hook"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingHookId === hook.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={editingHookText}
                          onChange={(e) => setEditingHookText(e.target.value)}
                          className="w-full text-xs sm:text-sm font-bold bg-white p-3 rounded-xl border-2 border-[#FF6B00] text-[#1A1A1A] focus:outline-none"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-black text-[#1A1A1A] mb-1.5 leading-snug">
                          "{hook.text}"
                        </p>
                        <p className="text-xs text-gray-600 italic font-medium">
                          💡 {hook.whyItWorks}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION C: TIMED CAPTION OVERLAYS */}
            <div id="section-overlays" className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#1A1A1A]">
                    C
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                    Timed Screen Words (Muted Viewers)
                  </h2>
                </div>

                <button
                  onClick={handleAddOverlay}
                  className="flex items-center gap-1 bg-[#F8F7F2] hover:bg-[#FFD8C2] text-[#1A1A1A] text-xs font-bold px-2.5 py-1.5 rounded-xl border border-[#1A1A1A] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {pack.captionOverlays.map((overlay, index) => (
                  <div
                    key={overlay.id || index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F7F2] p-3.5 rounded-2xl border-2 border-[#1A1A1A] text-xs font-bold text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      <span className="font-mono text-[11px] bg-[#1A1A1A] text-white px-2 py-0.5 rounded-lg shrink-0">
                        {overlay.startTime} - {overlay.endTime}
                      </span>

                      {editingOverlayId === overlay.id ? (
                        <input
                          type="text"
                          value={editingOverlayText}
                          onChange={(e) => setEditingOverlayText(e.target.value)}
                          className="flex-1 bg-white px-2 py-1 rounded border border-[#FF6B00] text-xs font-bold"
                        />
                      ) : (
                        <span className="font-black text-sm text-[#1A1A1A] flex-1">
                          "{overlay.text}"
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFFBF7] border border-[#1A1A1A] px-2 py-0.5 rounded-md">
                        {overlay.purpose}
                      </span>

                      {editingOverlayId === overlay.id ? (
                        <button
                          onClick={() => handleSaveOverlayEdit(overlay.id)}
                          className="p-1 text-white bg-[#1DB954] rounded-lg cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingOverlayId(overlay.id);
                            setEditingOverlayText(overlay.text);
                          }}
                          className="p-1 text-gray-500 hover:text-[#1A1A1A] bg-white rounded-lg border border-gray-300 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteOverlay(overlay.id)}
                        className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION D: PLATFORM CAPTIONS WITH AI QUICK FILTERS & DIRECT EDITING */}
            <div id="section-captions" className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#1A1A1A]">
                    D
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                    Platform Captions & Fast Modifiers
                  </h2>
                </div>

                {/* Platform Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {pack.platformCaptions.map((plat) => (
                    <button
                      key={plat.platform}
                      onClick={() => setActivePlatformTab(plat.platform)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border-2 ${
                        activePlatformTab === plat.platform
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FF6B00]"
                          : "bg-[#F8F7F2] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#FFD8C2]"
                      }`}
                    >
                      {plat.platform}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Quick Modifiers Bar */}
              <div className="bg-[#FFFBF7] p-3 rounded-2xl border-2 border-[#1A1A1A] mb-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>1-Tap AI Caption Modifiers:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAiModifyCaption("Add intense FOMO and limited weekend availability urgency", "High Urgency")}
                    disabled={isAiModifyingCaption}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFD8C2] border border-[#1A1A1A] text-xs font-black text-[#1A1A1A] transition-colors cursor-pointer shadow-2xs"
                  >
                    🔥 Add High Urgency
                  </button>
                  <button
                    onClick={() => handleAiModifyCaption("Rewrite with vibrant Nigerian Pidgin & English mix that excites local buyers", "Nigerian Pidgin Mix")}
                    disabled={isAiModifyingCaption}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFD8C2] border border-[#1A1A1A] text-xs font-black text-[#1A1A1A] transition-colors cursor-pointer shadow-2xs"
                  >
                    🇳🇬 Add Naija / Pidgin Vibes
                  </button>
                  <button
                    onClick={() => handleAiModifyCaption("Shorten to 2 punchy sentences ideal for fast TikTok scrollers", "Shorten")}
                    disabled={isAiModifyingCaption}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFD8C2] border border-[#1A1A1A] text-xs font-black text-[#1A1A1A] transition-colors cursor-pointer shadow-2xs"
                  >
                    ✂️ Shorten for TikTok
                  </button>
                  <button
                    onClick={() => handleAiModifyCaption("Make authoritative, elegant and trustworthy for luxury clientele", "Professional")}
                    disabled={isAiModifyingCaption}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFD8C2] border border-[#1A1A1A] text-xs font-black text-[#1A1A1A] transition-colors cursor-pointer shadow-2xs"
                  >
                    💼 Make Luxury / Pro
                  </button>
                </div>
              </div>

              {/* Editable Caption Textarea */}
              {activePlatformData && (
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={activePlatformData.caption}
                      onChange={(e) => {
                        const updatedVal = e.target.value;
                        const updatedCaptions = pack.platformCaptions.map((p) =>
                          p.platform === activePlatformTab ? { ...p, caption: updatedVal } : p
                        );
                        updateCurrentPack({ ...pack, platformCaptions: updatedCaptions });
                      }}
                      rows={6}
                      className="w-full bg-[#F8F7F2] p-4 rounded-2xl border-2 border-[#1A1A1A] text-xs sm:text-sm font-medium text-[#1A1A1A] focus:outline-none focus:bg-white leading-relaxed"
                    />

                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${activePlatformData.caption}\n\n${activePlatformData.hashtags.join(" ")}`,
                          `caption-${activePlatformTab}`,
                          `Copied ${activePlatformTab} caption!`
                        )
                      }
                      className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#1A1A1A] hover:bg-black text-white text-xs font-black px-3 py-1.5 rounded-xl border border-[#1A1A1A] shadow-xs cursor-pointer"
                    >
                      {copiedKey === `caption-${activePlatformTab}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#1DB954]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Caption & Tags</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hashtags display */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {activePlatformData.hashtags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-white border border-[#1A1A1A] px-2 py-0.5 rounded-lg text-xs font-bold text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION E: REAL WHATSAPP TESTER & STATUS BROADCAST */}
            <div id="section-whatsapp" className="bg-[#E8F8EE] rounded-3xl border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1DB954] text-white border-2 border-[#1A1A1A] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_#1A1A1A]">
                    E
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#1A1A1A]">
                    WhatsApp Status & Real Test Suite
                  </h2>
                </div>
                <span className="text-xs font-black text-[#1DB954] bg-white border border-[#1DB954] px-2.5 py-1 rounded-xl">
                  Instant Customer Chat
                </span>
              </div>

              {/* Status Copy Box */}
              <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-4 mb-4 shadow-[2px_2px_0px_0px_#1A1A1A]">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                  Status Slide Copy
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#1A1A1A] whitespace-pre-wrap mb-3 leading-relaxed">
                  {pack.whatsappStatus.text}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    Order prompt: <strong>"{pack.whatsappStatus.directOrderPrompt}"</strong>
                  </span>
                  <button
                    onClick={() => copyToClipboard(pack.whatsappStatus.text, "wa-status", "Copied WhatsApp Status broadcast!")}
                    className="flex items-center gap-1 text-xs font-bold text-[#1DB954] hover:underline cursor-pointer"
                  >
                    {copiedKey === "wa-status" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "wa-status" ? "Copied" : "Copy Status"}</span>
                  </button>
                </div>
              </div>

              {/* Real WhatsApp Number Config & Live Test Button */}
              <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto flex-1">
                  <label className="text-[11px] font-black uppercase text-gray-600 block mb-1">
                    Your WhatsApp Business Number (with country code):
                  </label>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#1DB954]" />
                    <input
                      type="text"
                      value={merchantWhatsAppNumber}
                      onChange={(e) => setMerchantWhatsAppNumber(e.target.value)}
                      placeholder="e.g. 2348012345678 or 254712345678"
                      className="w-full bg-[#F8F7F2] px-3 py-1.5 rounded-xl border border-[#1A1A1A] text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsWhatsAppSimulatorOpen(true)}
                    className="w-full sm:w-auto bg-[#F8F7F2] hover:bg-[#FFD8C2] text-[#1A1A1A] text-xs font-black px-3.5 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer"
                  >
                    Preview Chat
                  </button>
                  <button
                    onClick={handleOpenRealWhatsApp}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#1DB954] hover:bg-[#179443] text-white text-xs font-black px-4 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Launch Test in WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Mobile Phone Mockup & Video Player (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#FF6B00]" />
                  <h3 className="text-base font-black text-[#1A1A1A]">
                    Live Social Preview
                  </h3>
                </div>
                <button
                  onClick={() => setIsPlayingMockup(!isPlayingMockup)}
                  className="flex items-center gap-1 text-xs font-bold bg-[#F8F7F2] hover:bg-[#FFD8C2] px-2.5 py-1 rounded-xl border border-[#1A1A1A] cursor-pointer"
                >
                  {isPlayingMockup ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingMockup ? "Pause" : "Play"}</span>
                </button>
              </div>

              {/* Phone Frame */}
              <div className="relative mx-auto max-w-[270px] aspect-[9/16] bg-[#1A1A1A] rounded-[36px] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] overflow-hidden flex flex-col justify-between p-3 text-white">
                
                {/* Background Video or Gradient */}
                {pack.brief.videoPreview ? (
                  <video
                    src={pack.brief.videoPreview}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-[#1A1A1A] flex items-center justify-center p-6 text-center">
                    <Video className="w-12 h-12 text-[#FF6B00]/40" />
                  </div>
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

                {/* Phone Top Notch */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-white/80 font-mono pt-1">
                  <span>9:41</span>
                  <div className="w-16 h-3.5 bg-black rounded-full border border-white/20" />
                  <span>5G</span>
                </div>

                {/* Center Dynamic On-Screen Captions */}
                <div className="relative z-10 my-auto text-center px-2">
                  <AnimatePresence mode="wait">
                    {pack.captionOverlays[mockupOverlayIndex] && (
                      <motion.div
                        key={mockupOverlayIndex}
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-black/75 backdrop-blur-md text-white border border-[#FF6B00] px-3.5 py-2 rounded-2xl shadow-xl inline-block"
                      >
                        <span className="text-xs font-black tracking-wide leading-snug">
                          {pack.captionOverlays[mockupOverlayIndex].text}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phone Bottom Meta */}
                <div className="relative z-10 text-xs space-y-1.5 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-[10px] font-black">
                      A
                    </span>
                    <span className="font-black text-xs text-white">
                      @{pack.brief.productTitle.toLowerCase().replace(/[^a-z0-9]/g, "")}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/90 font-medium line-clamp-2 leading-tight">
                    {pack.platformCaptions[0]?.caption}
                  </p>
                  <div className="bg-[#1DB954] text-white text-[10px] font-black px-2.5 py-1 rounded-lg text-center shadow-xs">
                    💬 {pack.primaryCta}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Overlay: {mockupOverlayIndex + 1} of {pack.captionOverlays.length}</span>
                <span className="font-bold text-[#FF6B00]">Previewing Reels / TikTok Mode</span>
              </div>
            </div>

            {/* Quick Strategy Rationale Card */}
            <div className="bg-[#FFFBF7] rounded-3xl border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_#1A1A1A]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">
                  Selling Strategy Blueprint
                </h4>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                {pack.styleRecommendation.rationale}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Upload & Replacement Modal */}
      <VideoUploadModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        pack={pack}
        onUpdateVideo={handleUpdateVideoData}
      />

      {/* WhatsApp Chat Simulator Modal */}
      {isWhatsAppSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#EFEAE2] rounded-3xl border-2 border-[#1A1A1A] max-w-sm w-full p-5 shadow-[6px_6px_0px_0px_#1A1A1A] relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-300 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#128C7E] text-white flex items-center justify-center font-bold text-xs">
                  WA
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1A1A1A] leading-none">
                    Customer Chat Preview
                  </h4>
                  <span className="text-[10px] text-green-700 font-bold">Online</span>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppSimulatorOpen(false)}
                className="text-gray-500 hover:text-black font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {/* Vendor Status card */}
              <div className="bg-white p-3 rounded-2xl rounded-tl-xs border border-gray-200 text-xs shadow-2xs">
                <span className="text-[10px] font-black text-[#128C7E] uppercase block mb-1">
                  Your Status Broadcast
                </span>
                <p className="text-gray-800 font-medium whitespace-pre-wrap">
                  {pack.whatsappStatus.text}
                </p>
              </div>

              {/* Customer inquiry bubble */}
              <div className="bg-[#DCF8C6] p-3 rounded-2xl rounded-tr-xs border border-green-200 text-xs shadow-2xs ml-6">
                <span className="text-[10px] font-bold text-gray-500 block mb-0.5">
                  Customer message:
                </span>
                <p className="text-[#1A1A1A] font-bold">
                  {pack.whatsappStatus.directOrderPrompt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWhatsAppSimulatorOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-400 bg-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsWhatsAppSimulatorOpen(false);
                  handleOpenRealWhatsApp();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1DB954] text-white text-xs font-black border-2 border-[#1A1A1A] shadow-xs cursor-pointer"
              >
                Open Real WA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
