import { useState } from "react";
import {
  FolderOpen,
  Search,
  PlusCircle,
  Film,
  Trash2,
  Copy,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Zap,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Check,
  MessageSquare,
  Tag,
  MapPin,
  Flame,
} from "lucide-react";
import { Project, SalesContentPack } from "../types";

interface ProjectsProps {
  projects: Project[];
  onOpenProject: (pack: SalesContentPack) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (project: Project) => void;
  onCreateNew: () => void;
  onShowToast?: (message: string, type?: "success" | "sparkle" | "info") => void;
}

export default function Projects({
  projects,
  onOpenProject,
  onDeleteProject,
  onDuplicateProject,
  onCreateNew,
  onShowToast,
}: ProjectsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.brief.category)))];

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    if (sortBy === "oldest") return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const filteredProjects = sortedProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brief.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brief.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brief.location && p.brief.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.pack.hooks?.[0]?.text && p.pack.hooks[0].text.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === "All" || p.brief.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const exportProjectJson = (project: Project) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(project.pack, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `africut-selling-kit-${project.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast?.(`Exported JSON for ${project.name}! 📄`, "info");
  };

  const handleQuickCopyWhatsApp = (project: Project) => {
    const text = project.pack.whatsappStatus?.text || project.pack.primaryCta;
    navigator.clipboard.writeText(text);
    setCopiedId(project.id);
    onShowToast?.(`Copied WhatsApp broadcast for ${project.name}! 💬`, "success");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDuplicate = (project: Project) => {
    onDuplicateProject(project);
    onShowToast?.(`Duplicated "${project.name}" selling kit! 🗂️`, "sparkle");
  };

  const handleDelete = (id: string, name: string) => {
    onDeleteProject(id);
    setDeleteConfirmId(null);
    onShowToast?.(`Deleted "${name}" from saved kits.`, "info");
  };

  return (
    <div id="projects-view-container" className="min-h-screen bg-[#FFFBF7] pt-20 sm:pt-24 pb-28 md:pb-16 text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1A1A1A] mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6B00] uppercase tracking-wider mb-1.5 bg-[#FDF2EB] px-3 py-1 rounded-full border border-[#FFD8C2]">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Permanent Selling Kits Database</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                Saved Social Selling Kits ({projects.length})
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium max-w-xl">
                All your video highlights, catchy hooks, WhatsApp broadcasts, and platform captions saved and structured for instant reuse.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onCreateNew}
                className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs sm:text-sm font-black px-5 py-3 rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Selling Kit</span>
              </button>
            </div>
          </div>

          {/* Search, Filter & Controls Toolbar */}
          <div className="mt-6 pt-6 border-t border-[#F0EBE5] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search kits by title, hook, location..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border-2 border-[#1A1A1A] bg-[#FFFBF7] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] transition-all font-bold placeholder:font-normal placeholder:text-gray-400"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 hidden sm:inline" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto px-3 py-2.5 text-xs font-bold rounded-xl border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] focus:outline-none cursor-pointer"
                >
                  <option value="newest">Recently Saved</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <div className="bg-[#F8F7F2] p-1 rounded-xl border-2 border-[#1A1A1A] flex items-center gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#1A1A1A] text-white shadow-2xs"
                      : "text-gray-600 hover:text-[#1A1A1A]"
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-[#1A1A1A] text-white shadow-2xs"
                      : "text-gray-600 hover:text-[#1A1A1A]"
                  }`}
                  title="List table view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto w-full pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border-2 ${
                  selectedCategory === cat
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FF6B00]"
                    : "bg-[#F8F7F2] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#FFD8C2]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-[#1A1A1A] p-12 text-center max-w-lg mx-auto shadow-[4px_4px_0px_0px_#1A1A1A]">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6B00] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#1A1A1A] mb-1">
              No matching selling kits found
            </h3>
            <p className="text-xs text-gray-600 font-medium mb-6 max-w-sm mx-auto">
              Try adjusting your search keywords or category filters, or create a brand new social selling kit now.
            </p>
            <div className="flex items-center justify-center">
              <button
                onClick={onCreateNew}
                className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-black text-xs px-6 py-3 rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Selling Kit</span>
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-[6px_6px_0px_0px_#FF6B00] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FDF2EB] text-[#FF6B00] border border-[#FFD8C2] px-2.5 py-0.5 rounded-lg">
                      {project.brief.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-bold">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(project.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-[#1A1A1A] group-hover:text-[#FF6B00] transition-colors mb-1">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium mb-3 flex-wrap">
                    {project.brief.location && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3 text-[#1DB954]" />
                        <span>{project.brief.location}</span>
                      </span>
                    )}
                    <span className="text-gray-400">•</span>
                    <span className="text-[#FF6B00] font-bold">
                      {project.pack.bestMoment.durationSeconds}s Highlight
                    </span>
                  </div>

                  {/* Hook Excerpt */}
                  {project.pack.hooks?.[0] && (
                    <div className="bg-[#F8F7F2] rounded-2xl p-3 border-2 border-[#1A1A1A] text-xs mb-4 shadow-[2px_2px_0px_0px_#1A1A1A]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase text-[#FF6B00]">
                          {project.pack.hooks[0].hookNumber} ({project.pack.hooks[0].style})
                        </span>
                      </div>
                      <p className="text-[#1A1A1A] font-black italic line-clamp-2">
                        "{project.pack.hooks[0].text}"
                      </p>
                    </div>
                  )}

                  {/* WhatsApp Broadcast Teaser */}
                  <div className="bg-[#FFFBF7] p-2.5 rounded-xl border border-gray-200 text-xs mb-4 flex items-center justify-between">
                    <span className="text-[11px] text-gray-600 truncate mr-2 font-medium">
                      💬 {project.pack.whatsappStatus?.text?.slice(0, 45)}...
                    </span>
                    <button
                      onClick={() => handleQuickCopyWhatsApp(project)}
                      className="shrink-0 text-[11px] font-bold text-[#1DB954] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === project.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === project.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-4 border-t border-[#F0EBE5] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(project)}
                      className="p-2 text-gray-600 hover:text-[#1A1A1A] rounded-xl hover:bg-[#F8F7F2] border border-transparent hover:border-gray-300 transition-colors cursor-pointer"
                      title="Duplicate kit"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => exportProjectJson(project)}
                      className="p-2 text-gray-600 hover:text-[#1A1A1A] rounded-xl hover:bg-[#F8F7F2] border border-transparent hover:border-gray-300 transition-colors cursor-pointer"
                      title="Export JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                      title="Delete kit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenProject(project.pack)}
                    className="flex items-center gap-1 text-xs font-black text-white bg-[#FF6B00] hover:bg-[#e05e00] px-4 py-2 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>Open & Edit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table List View */
          <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F7F2] border-b-2 border-[#1A1A1A] text-[#1A1A1A] font-black uppercase text-[11px]">
                  <tr>
                    <th className="p-4">Kit Name & Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Top Hook</th>
                    <th className="p-4">Highlight</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-[#FFFBF7] transition-colors">
                      <td className="p-4 font-bold text-[#1A1A1A]">
                        <div className="font-black text-sm">{project.name}</div>
                        <div className="text-gray-500 text-[11px]">{project.brief.salesGoal}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#FDF2EB] text-[#FF6B00] border border-[#FFD8C2] px-2.5 py-0.5 rounded-lg text-[10px] font-black">
                          {project.brief.category}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-gray-700 font-semibold">
                        "{project.pack.hooks?.[0]?.text || "N/A"}"
                      </td>
                      <td className="p-4 font-mono font-bold text-[#FF6B00]">
                        {project.pack.bestMoment.startTime} - {project.pack.bestMoment.endTime}
                      </td>
                      <td className="p-4 text-gray-500 font-mono">
                        {new Date(project.savedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleQuickCopyWhatsApp(project)}
                            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-[#1DB954]"
                            title="Copy WhatsApp"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenProject(project.pack)}
                            className="bg-[#FF6B00] text-white px-3 py-1.5 rounded-lg border-2 border-[#1A1A1A] font-black shadow-xs hover:bg-[#e05e00]"
                          >
                            Open
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 max-w-sm w-full shadow-[6px_6px_0px_0px_#1A1A1A]">
              <h3 className="text-lg font-black text-[#1A1A1A] mb-2">
                Delete this Selling Kit?
              </h3>
              <p className="text-xs text-gray-600 font-medium mb-6">
                This will remove this product kit from your saved database. You can always regenerate a new kit from your video anytime.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const prj = projects.find((p) => p.id === deleteConfirmId);
                    handleDelete(deleteConfirmId, prj?.name || "Kit");
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer"
                >
                  Delete Kit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
