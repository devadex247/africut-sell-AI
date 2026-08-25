import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  X,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Terminal,
  ShieldCheck,
  Zap,
  RefreshCw,
} from "lucide-react";

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string, type?: "success" | "sparkle" | "info") => void;
}

export default function AiSettingsModal({ isOpen, onClose, onShowToast }: AiSettingsModalProps) {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkApiHealth();
    }
  }, [isOpen]);

  const checkApiHealth = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHasApiKey(data.hasGeminiKey);
    } catch {
      setHasApiKey(false);
    }
  };

  const handleTestAi = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Test Gemini API connection. Reply with 'Dala AI is fully connected and ready for social selling!'" }],
          activePack: null,
          savedProjects: [],
        }),
      });
      const data = await res.json();
      if (data && data.response) {
        setTestResult(data.response);
        onShowToast?.("AI connection test successful! 🚀", "success");
      } else {
        setTestResult("Connected, but received unexpected response format.");
      }
    } catch (e: any) {
      setTestResult(`Test failed: ${e.message || "Network error"}`);
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-[#1E1E1E] text-[#1A1A1A] dark:text-[#F3F4F6] rounded-3xl border-2 border-[#1A1A1A] dark:border-zinc-700 p-6 sm:p-8 max-w-xl w-full shadow-[8px_8px_0px_0px_#1A1A1A] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#F8F7F2] dark:bg-zinc-800 text-[#1A1A1A] dark:text-white border-2 border-[#1A1A1A] dark:border-zinc-700 hover:bg-[#FFD8C2] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black">Dala AI & Gemini API Configuration</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Manage API keys for GitHub repository deployments & live content generation.
            </p>
          </div>
        </div>

        {/* Status Box */}
        <div className={`p-4 rounded-2xl border-2 mb-6 flex items-center justify-between gap-3 ${
          hasApiKey
            ? "bg-[#E8F8EE] border-[#1DB954] text-[#1A1A1A]"
            : "bg-[#FDF2EB] border-[#FF6B00] text-[#1A1A1A]"
        }`}>
          <div className="flex items-center gap-3">
            {hasApiKey ? (
              <CheckCircle2 className="w-6 h-6 text-[#1DB954] shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-[#FF6B00] shrink-0" />
            )}
            <div>
              <div className="font-black text-sm">
                {hasApiKey ? "Gemini API Key is Active & Configured" : "Gemini API Key Not Detected in Environment"}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {hasApiKey
                  ? "Dala AI is fully powered by Gemini for sales kit creation, hook writing, and chat."
                  : "Add your GEMINI_API_KEY to your environment variables or GitHub Secrets to enable AI."}
              </div>
            </div>
          </div>
          <button
            onClick={checkApiHealth}
            className="p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-300 dark:border-zinc-700 text-xs font-bold hover:bg-gray-100 cursor-pointer"
            title="Refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* GitHub Deployment Instructions */}
        <div className="space-y-4 mb-6 text-xs sm:text-sm">
          <h3 className="font-black flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#FF6B00]" />
            <span>How to Configure AI When Deploying from GitHub:</span>
          </h3>
          <div className="bg-[#F8F7F2] dark:bg-zinc-900 p-4 rounded-2xl border-2 border-[#1A1A1A] dark:border-zinc-700 space-y-2 text-gray-700 dark:text-gray-300 font-medium">
            <p>
              1. Get your free API key from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-[#FF6B00] font-bold underline">Google AI Studio</a>.
            </p>
            <p>
              2. When deploying to Vercel, Render, Railway, or Google Cloud Run, add the following environment variable in your project settings:
            </p>
            <div className="bg-black text-green-400 font-mono text-xs p-2.5 rounded-xl select-all border border-zinc-700">
              GEMINI_API_KEY=your_actual_gemini_api_key_here
            </div>
            <p className="text-[11px] text-gray-500">
              * AfriCut Sell's Express backend (`server.ts`) securely proxies all Gemini requests server-side without exposing your key to the browser.
            </p>
          </div>
        </div>

        {/* Live Test Section */}
        <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500 font-medium">
            {testResult ? <span className="text-[#1DB954] font-bold">{testResult}</span> : "Test live AI connection instantly."}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleTestAi}
              disabled={isTesting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-black text-xs px-5 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{isTesting ? "Testing AI..." : "Test AI Connection"}</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-[#F8F7F2] dark:bg-zinc-800 hover:bg-gray-200 text-[#1A1A1A] dark:text-white font-bold text-xs px-4 py-2.5 rounded-xl border-2 border-[#1A1A1A] dark:border-zinc-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
