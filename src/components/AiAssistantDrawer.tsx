import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Zap,
  Check,
  RotateCcw,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  Layers,
  ArrowRight,
  Sparkle,
} from "lucide-react";
import { SalesContentPack, Project } from "../types";
import { askAiConsultant, ChatMessage } from "../services/aiService";

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePack: SalesContentPack | null;
  savedProjects: Project[];
  onApplyKitUpdate?: (updatedFields: Partial<SalesContentPack>) => void;
  onShowToast?: (message: string, type?: "success" | "sparkle" | "info") => void;
}

const DEFAULT_QUICK_PROMPTS = [
  { label: "Make hooks 3x more urgent 🔥", query: "Rewrite my hooks to make them 3x more urgent with strong FOMO triggers." },
  { label: "Add Nigerian Pidgin / Naija vibes 🇳🇬", query: "Give me an Instagram Reels caption with authentic Nigerian Pidgin and English mix." },
  { label: "WhatsApp Status Broadcast 💬", query: "Suggest a high-converting 3-slide WhatsApp Status broadcast sequence for this product." },
  { label: "Handle 'How much?' DMs 💰", query: "How do I reply to customers who only comment 'How much?' or 'Price' so they actually order?" },
  { label: "Audit my saved projects 🎯", query: "Analyze all my saved projects in AfriCut Sell and suggest 3 ways I can improve my overall sales." },
  { label: "Suggest tighter highlight ✂️", query: "Suggest a tighter 20-second video highlight moment and explain what visual cue to focus on." },
];

export default function AiAssistantDrawer({
  isOpen,
  onClose,
  activePack,
  savedProjects,
  onApplyKitUpdate,
  onShowToast,
}: AiAssistantDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      content: `Hello! I am your **Dala AI Sales Consultant** 🚀\n\nI have full contextual access to your active selling kit ${
        activePack ? `(**"${activePack.brief.productTitle}"**)` : ""
      } and all **${savedProjects.length} saved kits** in your database.\n\nAsk me anything about rewriting hooks, handling customer price objections, or creating high-converting WhatsApp broadcasts!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedActionIds, setAppliedActionIds] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await askAiConsultant({
        messages: history,
        activePack,
        savedProjects,
        userQuery: query,
      });

      const modelMsg: ChatMessage = {
        id: "model-" + Date.now(),
        role: "model",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedAction: res.suggestedAction,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "model",
          content: "Sorry, I had a brief connection hiccup. But remember: keep your product offer crisp and always state your WhatsApp number or link clearly!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = (msgId: string, action: any) => {
    if (!action || !onApplyKitUpdate) return;

    if (action.action === "UPDATE_HOOKS" && action.hooks) {
      onApplyKitUpdate({ hooks: action.hooks });
      onShowToast?.("Updated kit with AI suggested hooks! 🔥", "sparkle");
    } else if (action.action === "UPDATE_CAPTION" && action.caption) {
      if (activePack) {
        const updatedCaptions = activePack.platformCaptions.map((pc) =>
          pc.platform.toLowerCase().includes(action.platform?.toLowerCase() || "reels")
            ? { ...pc, caption: action.caption, hashtags: action.hashtags || pc.hashtags, cta: action.cta || pc.cta }
            : pc
        );
        onApplyKitUpdate({ platformCaptions: updatedCaptions });
        onShowToast?.(`Applied revised ${action.platform || "Instagram"} caption! ✍️`, "sparkle");
      }
    } else if (action.action === "UPDATE_WHATSAPP") {
      if (activePack) {
        onApplyKitUpdate({
          whatsappStatus: {
            ...activePack.whatsappStatus,
            text: action.text || activePack.whatsappStatus.text,
            directOrderPrompt: action.directOrderPrompt || activePack.whatsappStatus.directOrderPrompt,
          },
        });
        onShowToast?.("Applied revised WhatsApp broadcast message! 💬", "sparkle");
      }
    } else if (action.action === "UPDATE_MOMENT") {
      onApplyKitUpdate({
        bestMoment: {
          startTime: action.startTime || "00:10",
          endTime: action.endTime || "00:38",
          durationSeconds: action.durationSeconds || 28,
          rationale: action.rationale || "AI optimized window",
          visualCue: action.visualCue || "High energy product reveal",
        },
      });
      onShowToast?.("Applied revised highlight timestamps! ✂️", "sparkle");
    }

    setAppliedActionIds((prev) => new Set(prev).add(msgId));
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "model",
        content: `Chat history cleared! Ready for new questions about your selling kit or social commerce strategy.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setAppliedActionIds(new Set());
    onShowToast?.("Chat conversation reset.", "info");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FFFBF7] border-l-2 border-[#1A1A1A] shadow-2xl flex flex-col justify-between relative"
            >
              {/* Top Header */}
              <div className="p-4 sm:p-5 bg-white border-b-2 border-[#1A1A1A] flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-[#1A1A1A] leading-none">
                        Dala AI Sales Consultant
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 mt-1">
                      African Social Commerce Expert
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleResetChat}
                    title="Reset Chat"
                    className="p-2 rounded-xl bg-[#F8F7F2] hover:bg-[#FFD8C2] border border-[#1A1A1A] text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#1A1A1A] text-[#1A1A1A] transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Context Pill */}
              {activePack ? (
                <div className="bg-[#FFF3E8] border-b border-[#FFD8C2] px-4 py-2 flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                    <span className="text-gray-500">Active Kit:</span>
                    <span className="truncate font-black">{activePack.brief.productTitle}</span>
                  </div>
                  <span className="text-[10px] bg-white border border-[#1A1A1A] px-2 py-0.5 rounded font-mono">
                    {savedProjects.length} Saved Kits
                  </span>
                </div>
              ) : (
                <div className="bg-[#F8F7F2] border-b border-[#E5E0D8] px-4 py-2 flex items-center justify-between text-xs font-bold text-gray-600">
                  <span>General Strategy Mode</span>
                  <span className="text-[10px] bg-white border border-gray-300 px-2 py-0.5 rounded">
                    {savedProjects.length} Kits Loaded
                  </span>
                </div>
              )}

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      {msg.role === "model" ? (
                        <>
                          <Bot className="w-3.5 h-3.5 text-[#FF6B00]" />
                          <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                            Dala AI
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                            You
                          </span>
                          <User className="w-3.5 h-3.5 text-[#1A1A1A]" />
                        </>
                      )}
                      <span className="text-[10px] text-gray-400 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div
                      className={`rounded-2xl p-4 text-xs sm:text-sm font-medium leading-relaxed max-w-[90%] border-2 ${
                        msg.role === "user"
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] rounded-tr-xs shadow-[3px_3px_0px_0px_#FF6B00]"
                          : "bg-white text-[#1A1A1A] border-[#1A1A1A] rounded-tl-xs shadow-[3px_3px_0px_0px_#1A1A1A]"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Suggested Action Card */}
                      {msg.suggestedAction && activePack && onApplyKitUpdate && (
                        <div className="mt-3 pt-3 border-t border-[#F0EBE5] bg-[#FFFBF7] p-3 rounded-xl border border-[#1A1A1A]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] flex items-center gap-1">
                              <Sparkle className="w-3 h-3" />
                              <span>Actionable Improvement</span>
                            </span>
                          </div>

                          <button
                            onClick={() => handleApplyAction(msg.id, msg.suggestedAction)}
                            disabled={appliedActionIds.has(msg.id)}
                            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border-2 border-[#1A1A1A] text-xs font-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] ${
                              appliedActionIds.has(msg.id)
                                ? "bg-[#1DB954] text-white"
                                : "bg-[#FF6B00] hover:bg-[#e05e00] text-white"
                            }`}
                          >
                            {appliedActionIds.has(msg.id) ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Applied to Active Kit!</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5" />
                                <span>Apply Directly to Active Kit</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white border-2 border-[#1A1A1A] p-3 rounded-2xl w-fit shadow-[2px_2px_0px_0px_#1A1A1A]">
                    <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                    <span>Dala AI is reviewing your project base & thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-3 bg-[#F8F7F2] border-t border-b border-[#E5E0D8] shrink-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#FF6B00]" />
                  <span>Quick Sales Prompts</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {DEFAULT_QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt.query)}
                      disabled={isLoading}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FFD8C2] border border-[#1A1A1A] text-[11px] font-bold text-[#1A1A1A] whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Input */}
              <div className="p-4 bg-white border-t-2 border-[#1A1A1A] shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Dala AI about hooks, captions, sales..."
                    disabled={isLoading}
                    className="flex-1 bg-[#F8F7F2] text-xs sm:text-sm font-bold text-[#1A1A1A] px-4 py-3 rounded-xl border-2 border-[#1A1A1A] focus:outline-none focus:border-[#FF6B00]"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className={`p-3 rounded-xl border-2 border-[#1A1A1A] font-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] ${
                      inputValue.trim() && !isLoading
                        ? "bg-[#FF6B00] hover:bg-[#e05e00] text-white"
                        : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
