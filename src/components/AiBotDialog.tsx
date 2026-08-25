import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  X,
  Bot,
  Check,
  RefreshCw,
  Zap,
  Image as ImageIcon,
  Tag,
  CheckCircle2,
} from "lucide-react";

interface AiBotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  category: string;
  onApplyBenefit: (benefit: string, imageDetails?: string) => void;
  onShowToast?: (message: string, type?: "success" | "sparkle") => void;
}

export default function AiBotDialog({
  isOpen,
  onClose,
  productTitle,
  category,
  onApplyBenefit,
  onShowToast,
}: AiBotDialogProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    mainBenefit: string;
    imageDetails: string;
    sellingPoints: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen, productTitle]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/suggest-benefit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: productTitle || "Custom Product",
          category: category || "General",
        }),
      });
      const data = await res.json();
      if (data && data.success) {
        setSuggestions({
          mainBenefit: data.mainBenefit,
          imageDetails: data.imageDetails || "Warm professional lighting, clean high-contrast visual focus.",
          sellingPoints: data.sellingPoints || [
            "Top quality material & craftsmanship",
            "Customer favorite in your category",
            "Fast nationwide delivery",
          ],
        });
      }
    } catch (e) {
      console.error("Error fetching AI suggestions:", e);
      setSuggestions({
        mainBenefit: `High-performance ${productTitle || "product"} crafted for maximum customer delight and reliability.`,
        imageDetails: `Clean minimalist backdrop with vibrant warm lighting highlighting the product details.`,
        sellingPoints: [
          `Premium standard for ${category}`,
          `High customer satisfaction & repeat orders`,
          `Ready for immediate delivery`,
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="bg-white dark:bg-[#1E1E1E] text-[#1A1A1A] dark:text-[#F3F4F6] rounded-3xl border-2 border-[#1A1A1A] dark:border-zinc-700 p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0px_0px_#1A1A1A] relative overflow-hidden"
      >
        {/* Top Decorative Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF6B00]" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#F8F7F2] dark:bg-zinc-800 text-[#1A1A1A] dark:text-white border-2 border-[#1A1A1A] dark:border-zinc-700 hover:bg-[#FFD8C2] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Bot Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[3px_3px_0px_0px_#1A1A1A] shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">Dala AI Bot Assistant</h2>
              <span className="bg-[#E8F8EE] text-[#1DB954] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#1DB954]">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Analyzed "{productTitle || "Your Product"}" in <span className="font-bold text-[#FF6B00]">{category}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
            <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Dala AI is analyzing product title & generating selling points...
            </p>
          </div>
        ) : suggestions ? (
          <div className="space-y-5">
            {/* Main Benefit Box */}
            <div className="bg-[#FDF2EB] dark:bg-zinc-900/80 p-4 rounded-2xl border-2 border-[#1A1A1A] dark:border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF6B00] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Suggested Main Benefit / Selling Point</span>
                </span>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A] dark:text-white leading-relaxed">
                "{suggestions.mainBenefit}"
              </p>
            </div>

            {/* Image Generated Details */}
            <div className="bg-[#F8F7F2] dark:bg-zinc-900 p-4 rounded-2xl border-2 border-[#1A1A1A] dark:border-zinc-700">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1A1A1A] dark:text-gray-300 mb-1.5">
                <ImageIcon className="w-4 h-4 text-[#FF6B00]" />
                <span>Recommended Visual / Image Generation Details</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {suggestions.imageDetails}
              </p>
            </div>

            {/* Key Bullet Points */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Key Selling Points (For Hooks & Captions)
              </span>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.sellingPoints.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A] dark:text-gray-200 bg-white dark:bg-zinc-800 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={fetchSuggestions}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-[#F8F7F2] dark:bg-zinc-800 hover:bg-gray-200 text-[#1A1A1A] dark:text-white border-2 border-[#1A1A1A] dark:border-zinc-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
              <button
                onClick={() => {
                  onApplyBenefit(suggestions.mainBenefit, suggestions.imageDetails);
                  onShowToast?.("Applied AI Benefit & Details successfully! ✨", "success");
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white border-2 border-[#1A1A1A] text-xs font-black shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-2 cursor-pointer transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Apply to Form</span>
              </button>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
