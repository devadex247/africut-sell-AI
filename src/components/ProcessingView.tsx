import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  Circle,
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Flame,
  Check,
} from "lucide-react";
import { SalesBrief } from "../types";

interface ProcessingViewProps {
  brief: SalesBrief;
  onComplete: () => void;
}

interface StepItem {
  id: string;
  number: string;
  title: string;
  activeText: string;
  completedText: string;
  insight: string;
}

const STEPS: StepItem[] = [
  {
    id: "step-1",
    number: "01",
    title: "Understanding your product",
    activeText: "Analyzing category, main value proposition and buyer persona...",
    completedText: "Core product value proposition & buyer profile identified",
    insight: "Identified target buyer psychology and primary conversion triggers",
  },
  {
    id: "step-2",
    number: "02",
    title: "Finding your strongest selling point",
    activeText: "Scanning footage for the most compelling 20–45s product reveal...",
    completedText: "Optimal 28–35s highlight moment pinpointed with visual retention cues",
    insight: "Calculated peak visual payoff window for maximum watch time",
  },
  {
    id: "step-3",
    number: "03",
    title: "Analyzing your content",
    activeText: "Evaluating video pacing, retention hooks and rhythm...",
    completedText: "Visual flow structured for high social media retention",
    insight: "Synced timed caption intervals to maintain viewer attention",
  },
  {
    id: "step-4",
    number: "04",
    title: "Creating your hooks",
    activeText: "Crafting 3 scroll-stopping curiosity, emotional & offer hook variants...",
    completedText: "3 high-converting hook angles generated",
    insight: "Generated Curiosity, Problem/Emotional & Direct Benefit hooks",
  },
  {
    id: "step-5",
    number: "05",
    title: "Writing platform captions",
    activeText: "Tailoring captions for Instagram Reels, TikTok & direct WhatsApp order messages...",
    completedText: "Multi-channel captions & direct WhatsApp order links finalized",
    insight: "Formatted platform captions with hashtags and direct order actions",
  },
];

export default function ProcessingView({ brief, onComplete }: ProcessingViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveInsights, setLiveInsights] = useState<string[]>([]);

  useEffect(() => {
    // Timer counter
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => +(prev + 0.1).toFixed(1));
    }, 100);

    // Progress bar smooth interpolation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 5) + 3;
        return Math.min(prev + increment, 98);
      });
    }, 180);

    // Step-by-step sequential progression
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < STEPS.length) {
          // Add completed insight
          setLiveInsights((insights) => [...insights, STEPS[prev].insight]);
          return next;
        } else {
          clearInterval(stepInterval);
          setProgress(100);
          setLiveInsights((insights) => [...insights, STEPS[STEPS.length - 1].insight]);
          return prev;
        }
      });
    }, 750);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div id="processing-screen" className="min-h-screen bg-[#FFFBF7] pt-20 sm:pt-24 pb-20 flex items-center justify-center px-4 sm:px-6 text-[#1A1A1A]">
      <div className="max-w-2xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#1A1A1A] text-center relative overflow-hidden"
        >
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#FF6B00]" />

          {/* Engine Header Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FDF2EB] text-[#FF6B00] border-2 border-[#FFD8C2] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#FF6B00] animate-spin" />
            <span>Smart Sales Writer</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A] tracking-tight mb-2">
            Creating your Social Selling Kit
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 mb-6 font-medium max-w-lg mx-auto">
            Transforming <span className="font-black text-[#1A1A1A]">"{brief.productTitle || 'Your Product'}"</span> ({brief.category}) into high-converting social campaigns.
          </p>

          {/* Real-time Progress Bar & Timer */}
          <div className="bg-[#F8F7F2] rounded-2xl p-4 border-2 border-[#1A1A1A] mb-8 text-left">
            <div className="flex items-center justify-between text-xs font-black text-[#1A1A1A] mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                <span>AI Progress: Step {Math.min(currentStepIndex + 1, STEPS.length)} of {STEPS.length}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-mono text-[11px] font-bold">
                  {elapsedSeconds.toFixed(1)}s elapsed
                </span>
                <span className="text-[#FF6B00] font-mono font-black text-sm">
                  {progress}%
                </span>
              </div>
            </div>

            <div className="w-full bg-white border-2 border-[#1A1A1A] h-3.5 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="bg-[#FF6B00] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step-by-Step Progress with Checkmarks & Spinner */}
          <div className="space-y-3 text-left mb-8">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex || progress >= 98;
              const isCurrent = idx === currentStepIndex && progress < 98;
              const isPending = idx > currentStepIndex && progress < 98;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                    isCurrent
                      ? "bg-[#FFFBF7] border-[#1A1A1A] shadow-[4px_4px_0px_0px_#FF6B00]"
                      : isCompleted
                      ? "bg-[#F8F7F2] border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
                      : "bg-white/60 border-gray-300 opacity-60"
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-[#1DB954] text-white border border-[#1A1A1A] flex items-center justify-center shadow-[1px_1px_0px_0px_#1A1A1A]">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-[#FF6B00] text-white border border-[#1A1A1A] flex items-center justify-center shadow-[1px_1px_0px_0px_#1A1A1A]">
                        <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400 bg-white flex items-center justify-center text-[11px] font-mono font-bold text-gray-400">
                        {step.number}
                      </div>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-black ${
                          isCurrent
                            ? "text-[#1A1A1A]"
                            : isCompleted
                            ? "text-[#1A1A1A]"
                            : "text-gray-500"
                        }`}>
                          {isCompleted ? `✓ ${step.title}` : isCurrent ? `● ${step.title}` : `○ ${step.title}`}
                        </span>
                      </div>

                      {/* Status Pill */}
                      {isCompleted && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#E8F8EE] text-[#1DB954] border border-[#B7EFC5] px-2 py-0.5 rounded-md shrink-0">
                          Done
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF6B00] text-white border border-[#1A1A1A] px-2 py-0.5 rounded-md shrink-0 animate-pulse">
                          Processing
                        </span>
                      )}
                    </div>

                    {/* Dynamic Subtext */}
                    <p className={`text-xs mt-1 font-medium ${
                      isCurrent
                        ? "text-[#FF6B00] font-bold"
                        : isCompleted
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}>
                      {isCompleted
                        ? step.completedText
                        : isCurrent
                        ? step.activeText
                        : "Waiting in queue..."}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Live AI Anticipation Stream */}
          <div className="bg-[#FFFBF7] rounded-2xl border-2 border-[#1A1A1A] p-4 text-left shadow-[2px_2px_0px_0px_#1A1A1A] mb-6">
            <div className="flex items-center gap-2 text-xs font-black text-[#FF6B00] uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Live AI Insights & Extraction</span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#1A1A1A] font-bold">
                <span className="text-[#1DB954]">✓</span>
                <span>Category set to <span className="underline decoration-[#FF6B00]">{brief.category}</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1A1A1A] font-bold">
                <span className="text-[#1DB954]">✓</span>
                <span>Target channels: {brief.platforms?.join(", ") || "Instagram, TikTok, WhatsApp"}</span>
              </div>
              {liveInsights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs text-gray-700 font-medium"
                >
                  <span className="text-[#FF6B00]">✦</span>
                  <span>{insight}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#1DB954]" />
            <span>Generating tailored conversion copy for African social commerce</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
