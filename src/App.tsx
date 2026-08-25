import { useState, useEffect } from "react";
import { AppView, Project, SalesBrief, SalesContentPack } from "./types";
import { generateSalesContentPack } from "./services/aiService";
import Navbar from "./components/Navbar";
import LandingHero from "./components/LandingHero";
import CreateFlow from "./components/CreateFlow";
import ProcessingView from "./components/ProcessingView";
import ContentPack from "./components/ContentPack";
import Projects from "./components/Projects";
import TourGuide from "./components/TourGuide";
import AiSettingsModal from "./components/AiSettingsModal";

const STORAGE_KEY = "africut_sell_user_projects_v1";
const ONBOARDING_KEY = "africut_sell_onboarding_seen_v1";

const DEFAULT_BRIEF: SalesBrief = {
  videoFileName: "product-footage.mp4",
  productTitle: "My Product",
  category: "General Retail",
  mainBenefit: "High quality craftsmanship made with durable materials",
  priceNote: "Contact for Pricing",
  targetAudience: "Online shoppers & social media buyers",
  salesGoal: "Get WhatsApp orders",
  location: "Nationwide Delivery",
  platforms: ["Instagram Reels", "TikTok", "WhatsApp Status"],
  tone: "Friendly & Relatable",
  cta: "Send a direct WhatsApp message to order today",
};

export default function App() {
  const [activeView, setActiveView] = useState<AppView>("landing");
  const [currentBrief, setCurrentBrief] = useState<SalesBrief>(DEFAULT_BRIEF);
  const [currentPack, setCurrentPack] = useState<SalesContentPack | null>(null);
  const [showTourGuide, setShowTourGuide] = useState(false);
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load saved projects:", e);
    }
    return [];
  });

  // Onboard new user with Tour Guide on first load
  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem(ONBOARDING_KEY);
      if (!hasSeenTour) {
        // Trigger tour automatically for new users
        setShowTourGuide(true);
      }
    } catch (e) {
      console.warn("Error checking onboarding state:", e);
    }
  }, []);

  // Save projects to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn("Failed to persist projects:", e);
    }
  }, [projects]);

  // Check if active pack is currently in saved projects
  const isCurrentPackSaved = currentPack
    ? projects.some(
        (p) =>
          p.pack.id === currentPack.id ||
          (p.name === currentPack.brief.productTitle &&
            p.brief.category === currentPack.brief.category)
      )
    : false;

  // Handlers
  const handleNavigate = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartCreate = () => {
    setActiveView("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseTour = () => {
    setShowTourGuide(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch (e) {
      console.warn("Failed to save onboarding flag:", e);
    }
  };

  const handleCreateSubmit = async (brief: SalesBrief) => {
    setCurrentBrief(brief);
    setActiveView("processing");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      // Trigger AI generation
      const startTime = Date.now();
      const generatedPack = await generateSalesContentPack(brief);
      const elapsed = Date.now() - startTime;

      // Allow 3.8s for the step-by-step progress indicator to show all stages clearly
      const remainingTime = Math.max(0, 3800 - elapsed);
      setTimeout(() => {
        setCurrentPack(generatedPack);
        setActiveView("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, remainingTime);
    } catch (error) {
      console.error("Creation flow error:", error);
      setActiveView("result");
    }
  };

  const handleSelectPreset = (presetPack: SalesContentPack) => {
    setCurrentBrief(presetPack.brief);
    setCurrentPack(presetPack);
    setActiveView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProject = (pack: SalesContentPack) => {
    const existingIndex = projects.findIndex((p) => p.pack.id === pack.id);
    if (existingIndex >= 0) {
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: pack.brief.productTitle || "Untitled Product",
      brief: pack.brief,
      pack,
      savedAt: new Date().toISOString(),
    };

    setProjects([newProject, ...projects]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleDuplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `project-${Date.now()}`,
      name: `${project.name} (Copy)`,
      savedAt: new Date().toISOString(),
    };
    setProjects([duplicated, ...projects]);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col font-sans text-[#1A1A1A]">
      {/* Global Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        projectsCount={projects.length}
        onOpenTour={() => setShowTourGuide(true)}
        onOpenAiSettings={() => setShowAiSettings(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === "landing" && (
          <LandingHero
            onGetStarted={handleStartCreate}
            onSelectPreset={handleSelectPreset}
            onOpenTour={() => setShowTourGuide(true)}
            onOpenAiSettings={() => setShowAiSettings(true)}
          />
        )}

        {activeView === "create" && (
          <CreateFlow
            onSubmit={handleCreateSubmit}
            onCancel={() => handleNavigate("landing")}
          />
        )}

        {activeView === "processing" && (
          <ProcessingView
            brief={currentBrief}
            onComplete={() => handleNavigate("result")}
          />
        )}

        {activeView === "result" && currentPack && (
          <ContentPack
            pack={currentPack}
            onSaveProject={handleSaveProject}
            isSaved={isCurrentPackSaved}
            onCreateNew={handleStartCreate}
          />
        )}

        {activeView === "projects" && (
          <Projects
            projects={projects}
            onOpenProject={(pack) => {
              setCurrentPack(pack);
              setCurrentBrief(pack.brief);
              setActiveView("result");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDeleteProject={handleDeleteProject}
            onDuplicateProject={handleDuplicateProject}
            onCreateNew={handleStartCreate}
          />
        )}
      </main>

      {/* Onboarding Tour Guide Modal */}
      <TourGuide
        isOpen={showTourGuide}
        onClose={handleCloseTour}
        onStartCreate={() => {
          handleCloseTour();
          handleStartCreate();
        }}
      />

      {/* AI Settings & GitHub Deployment Modal */}
      <AiSettingsModal
        isOpen={showAiSettings}
        onClose={() => setShowAiSettings(false)}
        onShowToast={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3 rounded-2xl border-2 border-[#FF6B00] shadow-[4px_4px_0px_0px_#FF6B00] text-sm font-bold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
