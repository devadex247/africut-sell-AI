import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Video,
  Layers,
  MessageSquare,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Share2,
  Zap,
  HelpCircle,
  Film,
} from "lucide-react";

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCreate: () => void;
}

interface TourStep {
  title: string;
  badge: string;
  headline: string;
  description: string;
  icon: any;
  tip: string;
  features: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to AfriCut Sell",
    badge: "Built for African Micro-Sellers",
    headline: "Turn your raw phone videos into ready-to-sell social kits.",
    description:
      "Most small businesses record great products on their phones but struggle to edit videos or write captions that actually drive sales. AfriCut Sell solves this in seconds.",
    icon: Sparkles,
    tip: "No complex video editing or copywriting experience required.",
    features: [
      "Record 30s–3min raw video on your phone",
      "Smart Assistant finds your optimal 20–45s highlight moment",
      "Generates 3 scroll-stopping openers and 5 on-screen text lines",
      "Ready-to-post Instagram, TikTok, and WhatsApp broadcasts",
    ],
  },
  {
    title: "Step 1: Upload & Product Details",
    badge: "30-Second Setup",
    headline: "Upload raw footage and tell us what makes your product special.",
    description:
      "Simply upload your phone video. Pick your category (Food, Fashion, Beauty, Gadgets, etc.), add your product name, and choose your main selling goal like getting direct WhatsApp orders or Instagram DMs.",
    icon: Video,
    tip: "You don't need to cut or trim your clip—our smart assistant scans the full video for you.",
    features: [
      "Drag-and-drop or tap to upload from camera roll",
      "Select your business category and primary sales goal",
      "Set your delivery coverage (e.g. Lagos, Nairobi, Nationwide)",
      "Add custom pricing or urgency notes (e.g. limited slots)",
    ],
  },
  {
    title: "Step 2: Smart Sales Generator",
    badge: "Dala Studio Smart Sales Writer",
    headline: "5-Step sales writing creates your complete social selling kit.",
    description:
      "Our system pinpoints your strongest 20–45s product moment, writes 3 catchy attention hooks (Curiosity, Problem, Direct Offer), and structures timed caption lines.",
    icon: Zap,
    tip: "Watch the step-by-step progress indicator as each stage completes in real-time.",
    features: [
      "Step 01: Understand your product & offer",
      "Step 02: Decide strongest highlight timestamp",
      "Step 03: Write 3 catchy hook options",
      "Step 04: Adapt copy for Instagram, TikTok & WhatsApp",
      "Step 05: Package timed on-screen text & order instructions",
    ],
  },
  {
    title: "Step 3: Multi-Platform Captions & WhatsApp",
    badge: "Ready-To-Post Content",
    headline: "Get tailored captions, hashtags, and direct WhatsApp sales tools.",
    description:
      "Every social channel works differently. AfriCut generates storytelling captions for Instagram Reels, punchy scripts for TikTok, and broadcast messages for WhatsApp Status with 1-click test triggers.",
    icon: MessageSquare,
    tip: "Test your direct WhatsApp order message with one click before sending to customers.",
    features: [
      "Phone preview mockup with 5-step timed text overlays",
      "3 Hook alternatives to test which gets the most views",
      "Instagram Reels & TikTok captions with curated hashtags",
      "1-Click WhatsApp Status copy and direct order chat link",
    ],
  },
  {
    title: "Step 4: Saved Workspace & 1-Click Export",
    badge: "Your Sales Workspace",
    headline: "Save, duplicate, copy, or export your selling kits anytime.",
    description:
      "All your generated kits can be saved to your personal Projects workspace. Copy individual sections with one click or export complete JSON kits for your team.",
    icon: ShoppingBag,
    tip: "You can duplicate and modify past selling kits for recurring restocks and weekend deals.",
    features: [
      "Organized workspace filtered by category and search",
      "1-Click 'Copy All' to paste directly into your social schedulers",
      "Duplicate existing kits for new inventory launches",
      "Saved locally so your selling kits are always available",
    ],
  },
];

export default function TourGuide({
  isOpen,
  onClose,
  onStartCreate,
}: TourGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
      onStartCreate();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-2xl bg-[#FFFBF7] rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#1A1A1A] my-auto overflow-hidden text-[#1A1A1A]"
        >
          {/* Top Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#F8F7F2] border-b border-[#1A1A1A]">
            <div
              className="h-full bg-[#FF6B00] transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%`,
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white border-2 border-[#1A1A1A] flex items-center justify-center hover:bg-[#FFD8C2] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer text-[#1A1A1A]"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step Header */}
          <div className="flex items-center gap-2 mb-4 pt-1">
            <span className="text-xs font-black uppercase tracking-wider bg-[#FF6B00] text-white border border-[#1A1A1A] px-2.5 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_#1A1A1A]">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
              {currentStep.badge}
            </span>
          </div>

          {/* Step Icon & Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center shrink-0">
              <StepIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] leading-tight">
                {currentStep.headline}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Key Features / Highlights */}
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-4 sm:p-5 shadow-[2px_2px_0px_0px_#1A1A1A] mb-6">
            <div className="text-xs font-black uppercase tracking-wider text-[#FF6B00] mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Capabilities in This Step</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentStep.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-bold text-[#1A1A1A]">
                  <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="bg-[#F8F7F2] rounded-xl border-2 border-[#1A1A1A] p-3.5 text-xs text-[#1A1A1A] font-medium flex items-center gap-2.5 mb-6">
            <span className="text-base shrink-0">💡</span>
            <span>
              <strong className="font-black text-[#FF6B00]">Pro Tip:</strong> {currentStep.tip}
            </span>
          </div>

          {/* Step Navigation Dots & Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F0EBE5]">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer border border-[#1A1A1A] ${
                    currentStepIndex === idx
                      ? "w-8 bg-[#FF6B00]"
                      : "w-2.5 bg-white hover:bg-gray-200"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {currentStepIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black text-[#1A1A1A] bg-white hover:bg-[#F8F7F2] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                Skip Tour
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              >
                <span>{isLastStep ? "Start Creating Now" : "Next Step"}</span>
                {isLastStep ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
