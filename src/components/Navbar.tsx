import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  PlusCircle,
  FolderOpen,
  Sparkles,
  Menu,
  X,
  Zap,
  Film,
  Bot,
  Key,
} from "lucide-react";
import { AppView } from "../types";

interface NavbarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  projectsCount: number;
  onOpenTour: () => void;
  onOpenAiConsultant?: () => void;
  onOpenAiSettings?: () => void;
}

export default function Navbar({
  activeView,
  onNavigate,
  projectsCount,
  onOpenTour,
  onOpenAiConsultant,
  onOpenAiSettings,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Top Navbar */}
      <header
        id="africut-navbar"
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F0EBE5] text-[#1A1A1A] transition-all"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="nav-logo-btn"
              onClick={() => onNavigate("landing")}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#1A1A1A] bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform shrink-0">
                <img
                  src="/src/assets/images/africut_logo_1787658436266.jpg"
                  alt="AfriCut Sell Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl tracking-tight text-[#1A1A1A]">
                    AfriCut<span className="text-[#FF6B00]">Sell</span>
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-wider bg-[#FDF2EB] text-[#FF6B00] border border-[#FFD8C2] px-1.5 py-0.5 rounded-md ml-1">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                  <span>Powered by</span>
                  <span className="text-[#1A1A1A] font-bold">Dala Studio</span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              id="nav-home-btn"
              onClick={() => onNavigate("landing")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeView === "landing"
                  ? "bg-[#1A1A1A] text-white shadow-[2px_2px_0px_0px_#FF6B00]"
                  : "text-[#3D3D3D] hover:text-[#1A1A1A] hover:bg-[#F8F7F2]"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              id="nav-create-btn"
              onClick={() => onNavigate("create")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeView === "create" || activeView === "processing"
                  ? "bg-[#1A1A1A] text-white shadow-[2px_2px_0px_0px_#FF6B00]"
                  : "text-[#3D3D3D] hover:text-[#1A1A1A] hover:bg-[#F8F7F2]"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Kit</span>
            </button>

            <button
              id="nav-projects-btn"
              onClick={() => onNavigate("projects")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeView === "projects"
                  ? "bg-[#1A1A1A] text-white shadow-[2px_2px_0px_0px_#FF6B00]"
                  : "text-[#3D3D3D] hover:text-[#1A1A1A] hover:bg-[#F8F7F2]"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Saved Kits</span>
              {projectsCount > 0 && (
                <span className="text-xs bg-[#FF6B00] text-white px-2 py-0.5 rounded-full font-bold">
                  {projectsCount}
                </span>
              )}
            </button>

            {activeView === "result" && (
              <button
                id="nav-result-pill"
                onClick={() => onNavigate("result")}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#1DB954] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
              >
                <Film className="w-3.5 h-3.5 text-white" />
                <span>Active Kit</span>
              </button>
            )}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {onOpenAiSettings && (
              <button
                onClick={onOpenAiSettings}
                className="p-2.5 rounded-xl text-[#1A1A1A] bg-[#F8F7F2] hover:bg-[#FFD8C2] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer flex items-center gap-1"
                title="AI & GitHub Deployment Settings (GEMINI_API_KEY)"
              >
                <Key className="w-4 h-4 text-[#FF6B00]" />
              </button>
            )}

            {onOpenAiConsultant && (
              <button
                id="nav-ai-consultant-btn"
                onClick={onOpenAiConsultant}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#1A1A1A] hover:bg-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FF6B00] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                title="Chat with Dala AI Consultant"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Ask Dala AI</span>
              </button>
            )}

            <button
              id="nav-tour-btn"
              onClick={onOpenTour}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A1A] bg-[#F8F7F2] hover:bg-[#FFD8C2] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              title="Learn how AfriCut Sell works step-by-step"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Tour Guide</span>
            </button>

            <button
              id="nav-primary-create-cta"
              onClick={() => onNavigate("create")}
              className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs sm:text-sm font-black px-4 sm:px-5 py-2.5 rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Selling Kit</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1A1A1A] border-2 border-[#1A1A1A] bg-[#F8F7F2] hover:bg-[#FFD8C2] transition-colors shadow-[2px_2px_0px_0px_#1A1A1A]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="md:hidden fixed top-0 right-0 z-50 w-72 h-full bg-white shadow-2xl flex flex-col p-6 pt-20"
            >
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#F0EBE5]">
                <div className="w-9 h-9 bg-[#FF6B00] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-[2px_2px_0px_0px_#1A1A1A]">
                  <span>A</span>
                </div>
                <div>
                  <div className="font-black text-xl text-[#1A1A1A]">
                    AfriCut<span className="text-[#FF6B00]">Sell</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">By Dala Studio</div>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <button
                  onClick={() => {
                    onNavigate("landing");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeView === "landing" ? "bg-[#1A1A1A] text-white shadow-[2px_2px_0px_0px_#FF6B00]" : "text-[#3D3D3D] hover:bg-[#F8F7F2]"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate("create");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeView === "create" ? "bg-[#1A1A1A] text-white shadow-[2px_2px_0px_0px_#FF6B00]" : "text-[#3D3D3D] hover:bg-[#F8F7F2]"
                  }`}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create Sales Content</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate("projects");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeView === "projects" ? "bg-[#1A1A1A] text-white shadow-[2px_2px_0px_0px_#FF6B00]" : "text-[#3D3D3D] hover:bg-[#F8F7F2]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5" />
                    <span>Saved Projects</span>
                  </div>
                  {projectsCount > 0 && (
                    <span className="text-xs bg-[#FF6B00] text-white px-2 py-0.5 rounded-full font-bold">
                      {projectsCount}
                    </span>
                  )}
                </button>

                <div className="pt-4 border-t border-[#F0EBE5]">
                  <button
                    onClick={() => {
                      onOpenTour();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold bg-[#F8F7F2] text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                    <span>How it Works: Tour Guide</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-[#F0EBE5] text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Turn product videos into sales content.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Fixed Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0EBE5] py-2 px-6 flex items-center justify-around shadow-lg"
      >
        <button
          onClick={() => onNavigate("landing")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeView === "landing" ? "text-[#FF6B00] font-black" : "text-gray-500 font-bold"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </button>

        <button
          onClick={() => onNavigate("create")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeView === "create" || activeView === "processing"
              ? "text-[#FF6B00] font-black"
              : "text-gray-500 font-bold"
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center border border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]">
            <PlusCircle className="w-4 h-4" />
          </div>
          <span className="text-[11px]">Create</span>
        </button>

        <button
          onClick={() => onNavigate("projects")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
            activeView === "projects" ? "text-[#FF6B00] font-black" : "text-gray-500 font-bold"
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          <span className="text-[11px]">Projects</span>
          {projectsCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#FF6B00]" />
          )}
        </button>
      </nav>
    </>
  );
}
