import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type?: "success" | "info" | "sparkle" | "warning";
  title?: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto bg-[#1A1A1A] text-white p-4 rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#FF6B00] flex items-start gap-3 relative overflow-hidden"
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === "sparkle" ? (
                <div className="w-7 h-7 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : toast.type === "warning" ? (
                <div className="w-7 h-7 rounded-xl bg-[#DC2626] text-white flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : toast.type === "info" ? (
                <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-xl bg-[#1DB954] text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pr-4">
              {toast.title && (
                <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD8C2] mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs font-bold text-white leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
