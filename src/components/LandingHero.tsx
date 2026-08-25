import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
  Video,
  ShoppingBag,
  Clock,
  Eye,
  ShieldCheck,
  MessageSquare,
  MessageCircle,
  Copy,
  ChevronDown,
  Star,
  Flame,
  Smartphone,
  Tag,
  MapPin,
  Check,
  Layers,
  HelpCircle,
  Users,
  Award,
  AlertCircle,
  CheckCheck,
} from "lucide-react";
import { DEMO_PRESETS, DemoPreset } from "../data/presets";
import { SalesContentPack } from "../types";

interface LandingHeroProps {
  onGetStarted: () => void;
  onSelectPreset: (presetPack: SalesContentPack) => void;
  onOpenTour?: () => void;
  onOpenAiSettings?: () => void;
}

export default function LandingHero({
  onGetStarted,
  onSelectPreset,
  onOpenTour,
}: LandingHeroProps) {
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const activeDemo: DemoPreset = DEMO_PRESETS[activeDemoIndex];

  return (
    <div id="landing-page" className="min-h-screen bg-[#FFFBF7] pt-20 sm:pt-24 pb-24 md:pb-20 text-[#1A1A1A]">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FDF2EB] border-2 border-[#FFD8C2] text-[#FF6B00] px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#FF6B00]" />
            <span>Built for African Social Sellers & Boutiques</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#1A1A1A] tracking-tight leading-[1.08] mb-6">
            Turn your phone videos into{" "}
            <span className="text-[#FF6B00] relative inline-block">
              direct customer sales.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#4A4A4A] leading-relaxed max-w-3xl mx-auto mb-8 font-medium">
            You record great products on your phone. AfriCut Sell finds your best selling moment, writes scroll-stopping words, and gives you ready-to-paste captions for WhatsApp, Instagram, and TikTok.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              id="hero-create-btn"
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-black text-base sm:text-lg px-8 py-4 rounded-2xl border-2 border-[#1A1A1A] shadow-[5px_5px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer"
            >
              <span>Make My Selling Kit</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {onOpenTour && (
              <button
                id="hero-tour-btn"
                onClick={onOpenTour}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-[#F8F7F2] text-[#1A1A1A] font-black text-base sm:text-lg px-7 py-4 rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span>See How It Works (1 Min Tour)</span>
              </button>
            )}
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6 border-t border-[#F0EBE5] text-xs sm:text-sm font-bold text-[#4A4A4A]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]" />
              <span>Zero Video Editing Skills Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
              <span>Direct WhatsApp Order Links</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />
              <span>Tailored for Bakers, Fashion, Hair & Gadgets</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. THE SELLER PROBLEM: WHY RAW VIDEOS DON'T SELL */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24">
        <div className="bg-[#FFF3E8] rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-10 shadow-[4px_4px_0px_0px_#1A1A1A]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-black tracking-widest text-[#FF6B00] mb-2 inline-block">
              The Everyday Seller Struggle
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A] leading-tight">
              Why 90% of product videos get views but zero WhatsApp orders
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-3">
              Most vendors post good products, but buyers scroll past without messaging because 3 crucial sales pieces are missing:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Problem 1 */}
            <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-6 shadow-[2px_2px_0px_0px_#1A1A1A] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#DC2626] border-2 border-[#1A1A1A] flex items-center justify-center font-black text-lg mb-4 shadow-[2px_2px_0px_0px_#1A1A1A]">
                  ✕
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A] mb-2">
                  No Catchy First 3 Seconds
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  Buyers scroll through hundreds of videos a minute. Without a curiosity hook or relatable pain-point opener, they swipe away before ever seeing what you sell.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#DC2626]">
                Result: High drop-off in 2 seconds
              </div>
            </div>

            {/* Problem 2 */}
            <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-6 shadow-[2px_2px_0px_0px_#1A1A1A] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#DC2626] border-2 border-[#1A1A1A] flex items-center justify-center font-black text-lg mb-4 shadow-[2px_2px_0px_0px_#1A1A1A]">
                  ✕
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A] mb-2">
                  No Screen Words (Muted Video)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  Over 70% of viewers watch social videos on mute while commuting or working. If price, size, or benefits aren't on the screen, they don't know what you're offering.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#DC2626]">
                Result: Unclear offer & wasted views
              </div>
            </div>

            {/* Problem 3 */}
            <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-6 shadow-[2px_2px_0px_0px_#1A1A1A] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#DC2626] border-2 border-[#1A1A1A] flex items-center justify-center font-black text-lg mb-4 shadow-[2px_2px_0px_0px_#1A1A1A]">
                  ✕
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A] mb-2">
                  Weak Order Instructions
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  Vague captions like "Send DM" create friction. Customers want exact WhatsApp order messages, delivery location details, and urgency notes before they reach out.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#DC2626]">
                Result: "How much?" comments with zero sales
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW AFRICUT WORKS: 3 SIMPLE STEPS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24">
        <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-10 shadow-[4px_4px_0px_0px_#1A1A1A]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-black tracking-widest text-[#FF6B00] mb-2 inline-block">
              Simple 3-Step Social Selling
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A]">
              How AfriCut turns 1 phone clip into your entire sales post
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Step 1 */}
            <div className="bg-[#F8F7F2] rounded-2xl p-6 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] flex items-center justify-center font-black text-base shadow-[2px_2px_0px_0px_#1A1A1A]">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider bg-[#FFFBF7] border border-[#1A1A1A] px-2.5 py-1 rounded-lg">
                    Step 01
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A] mb-2">
                  Upload Your Phone Video
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  Record 30 seconds to 3 minutes on your phone. Show the texture, the cake slice, the dress fit, or unboxing. Tell us your product name, price, and delivery city.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F0EBE5] flex items-center gap-2 text-xs font-bold text-gray-600">
                <Clock className="w-4 h-4 text-[#FF6B00]" />
                <span>Takes less than 30 seconds</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FF6B00] text-white rounded-2xl p-6 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-[#FF6B00] border-2 border-[#1A1A1A] flex items-center justify-center font-black text-base shadow-[2px_2px_0px_0px_#1A1A1A]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider bg-white/20 border border-white px-2.5 py-1 rounded-lg text-white">
                    Step 02
                  </span>
                </div>
                <h3 className="text-lg font-black mb-2">
                  Smart Sales Assistant Writes
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
                  Our assistant scans your clip, finds your best 20–45s product moment, writes 3 catchy attention hooks, and formats timed screen text and WhatsApp order triggers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/30 flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Identifies peak buying triggers</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F8F7F2] rounded-2xl p-6 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1DB954] text-white border-2 border-[#1A1A1A] flex items-center justify-center font-black text-base shadow-[2px_2px_0px_0px_#1A1A1A]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider bg-[#E8F8EE] text-[#1DB954] border border-[#B7EFC5] px-2.5 py-1 rounded-lg">
                    Step 03
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A] mb-2">
                  Copy, Paste & Collect Orders
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  Copy tailored captions for Instagram Reels, TikTok, and WhatsApp Status with one tap. Use the direct WhatsApp test link to preview how customers will chat you up.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F0EBE5] flex items-center gap-2 text-xs font-bold text-[#1DB954]">
                <Share2 className="w-4 h-4 text-[#1DB954]" />
                <span>Ready to post immediately</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM SHOWCASE WITH CHIDINMA'S CAKE IMAGE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24">
        <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#1A1A1A] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6B00] uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4" />
                <span>Live Vendor Examples</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A]">
                See what your selling kit looks like
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                Tap between real business categories to see how AfriCut writes tailored content for each product.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {DEMO_PRESETS.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => setActiveDemoIndex(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                    activeDemoIndex === idx
                      ? "bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#FF6B00]"
                      : "bg-[#F8F7F2] text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#FFD8C2]"
                  }`}
                >
                  {preset.name} ({preset.category})
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE PRESET SHOWCASE CARD - SPECIALLY POLISHED FOR CHIDINMA'S CAKE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#FFFBF7] rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1A1A1A]">
            
            {/* Left: Product Image / Video Highlight Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] group bg-[#1A1A1A]">
                {/* Real Product Image for Chidinma's Cake or other presets */}
                {activeDemo.imageUrl ? (
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img
                      src={activeDemo.imageUrl}
                      alt={activeDemo.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full bg-[#1A1A1A] flex items-center justify-center p-6 text-white text-center">
                    <Video className="w-12 h-12 text-[#FF6B00] mb-2" />
                  </div>
                )}

                {/* Top Badge on Image */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span className="bg-[#FF6B00] text-white border border-[#1A1A1A] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#1A1A1A]">
                    {activeDemo.badge || activeDemo.category}
                  </span>
                </div>

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                    <span className="text-[#FFD8C2]">
                      Best Moment: {activeDemo.pack.bestMoment.startTime} – {activeDemo.pack.bestMoment.endTime}
                    </span>
                    <span className="bg-black/70 px-2 py-0.5 rounded border border-white/20 text-[10px]">
                      {activeDemo.pack.bestMoment.durationSeconds}s Highlight
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {activeDemo.pack.brief.productTitle}
                  </h3>
                </div>
              </div>

              {/* PREMIUM VENDOR DETAILS CARD */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#1A1A1A] text-xs space-y-3 font-medium shadow-[3px_3px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500 font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Price & Order:</span>
                  </span>
                  <span className="font-black text-[#1A1A1A] bg-[#FDF2EB] px-2.5 py-1 rounded-lg border border-[#FFD8C2]">
                    {activeDemo.priceTag || activeDemo.brief.priceNote || "Contact for Price"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>Coverage:</span>
                  </span>
                  <span className="font-bold text-[#1A1A1A]">
                    {activeDemo.deliveryTag || activeDemo.brief.location || "Lagos / Nationwide"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-gray-500 font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Selling Goal:</span>
                  </span>
                  <span className="font-bold text-[#FF6B00]">
                    {activeDemo.brief.salesGoal}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>Order Step:</span>
                  </span>
                  <span className="font-bold text-[#1A1A1A]">
                    {activeDemo.brief.cta}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onSelectPreset(activeDemo.pack)}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-black text-sm py-3.5 px-4 rounded-xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer"
                >
                  <span>Open & Edit This Kit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-gray-500 font-bold">
                  📹 All 3 vendor demos are fully editable & customizable with your own videos
                </p>
              </div>
            </div>

            {/* Right: Generated Selling Kit Highlights */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Highlight Hook Angle */}
              <div className="bg-white rounded-2xl p-5 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider bg-[#FDF2EB] px-2.5 py-0.5 rounded-md border border-[#FFD8C2]">
                      Catchy Opener 01 ({activeDemo.pack.hooks[0].style})
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-gray-500 uppercase">First 3 Seconds</span>
                </div>
                <p className="text-base font-black text-[#1A1A1A] leading-snug my-2">
                  "{activeDemo.pack.hooks[0].text}"
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  💡 <span className="font-bold text-[#1A1A1A]">Why this sells:</span> {activeDemo.pack.hooks[0].whyItWorks}
                </p>
              </div>

              {/* Timed On-Screen Text Overlays */}
              <div className="bg-white rounded-2xl p-5 border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
                    On-Screen Text for Muted Viewers
                  </span>
                  <span className="text-[11px] font-bold text-gray-500">5-Step Sequence</span>
                </div>
                <div className="space-y-2">
                  {activeDemo.pack.captionOverlays.slice(0, 3).map((overlay, oIdx) => (
                    <div
                      key={overlay.id || oIdx}
                      className="flex items-center gap-3 bg-[#F8F7F2] px-3.5 py-2.5 rounded-xl border border-[#1A1A1A] text-xs font-bold text-[#1A1A1A]"
                    >
                      <span className="font-mono text-[#FF6B00] font-black shrink-0 bg-white px-2 py-0.5 rounded border border-[#1A1A1A]">
                        {overlay.startTime}
                      </span>
                      <span className="truncate flex-1 font-black">
                        {overlay.text}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold shrink-0">
                        {overlay.purpose}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Status Broadcast Tool */}
              <div className="bg-[#E8F8EE] text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-2xl p-5 shadow-[3px_3px_0px_0px_#1A1A1A]">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-[#1DB954] uppercase tracking-wider">
                    <MessageCircle className="w-4 h-4 fill-[#1DB954] text-white" />
                    <span>WhatsApp Status Post & Direct Order Text</span>
                  </div>
                  <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded border border-[#1A1A1A]">
                    1-Click Ready
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#1A1A1A] text-xs font-mono whitespace-pre-line leading-relaxed text-[#1A1A1A] font-semibold">
                  {activeDemo.pack.whatsappStatus.text}
                </div>
                <p className="text-[11px] text-gray-600 font-medium mt-2">
                  📲 Customers tap your WhatsApp link and immediately send your pre-filled inquiry message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MANUAL EDITING VS AFRICUT SELL COMPARISON TABLE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24">
        <div className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-10 shadow-[4px_4px_0px_0px_#1A1A1A]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-black tracking-widest text-[#FF6B00] mb-2 inline-block">
              Why Sellers Love AfriCut
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A]">
              Manual editing vs. AfriCut Selling Kit
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2">
              Save hours of frustration trying to edit videos and stare at empty caption boxes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1A1A1A]">
                  <th className="py-4 px-4 font-black text-[#1A1A1A]">Selling Task</th>
                  <th className="py-4 px-4 font-black text-gray-400">Doing It Manually</th>
                  <th className="py-4 px-4 font-black text-[#FF6B00] bg-[#FFFBF7] rounded-t-xl">
                    With AfriCut Sell
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 font-bold text-[#1A1A1A]">Finding the best 30s moment</td>
                  <td className="py-4 px-4 text-gray-500 font-medium">Rewatching footage 10 times, trimming blindly (30–45 mins)</td>
                  <td className="py-4 px-4 font-black text-[#1DB954] bg-[#FFFBF7]">
                    ✓ AI pinpointed in 5 seconds
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-[#1A1A1A]">Writing scroll-stopping hooks</td>
                  <td className="py-4 px-4 text-gray-500 font-medium">Staring at blank screen, guessing what works (20 mins)</td>
                  <td className="py-4 px-4 font-black text-[#1DB954] bg-[#FFFBF7]">
                    ✓ 3 tailored curiosity & problem hooks
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-[#1A1A1A]">Writing on-screen text for mute viewers</td>
                  <td className="py-4 px-4 text-gray-500 font-medium">Manually typing captions and timestamps in phone apps (40 mins)</td>
                  <td className="py-4 px-4 font-black text-[#1DB954] bg-[#FFFBF7]">
                    ✓ 5 timed screen captions ready to paste
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-[#1A1A1A]">Writing Instagram & TikTok captions</td>
                  <td className="py-4 px-4 text-gray-500 font-medium">Copy-pasting generic lines with random hashtags (15 mins)</td>
                  <td className="py-4 px-4 font-black text-[#1DB954] bg-[#FFFBF7]">
                    ✓ Storytelling + local hashtags + order step
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-[#1A1A1A]">WhatsApp Status broadcast</td>
                  <td className="py-4 px-4 text-gray-500 font-medium">Messy unstructured text that buyers skip over</td>
                  <td className="py-4 px-4 font-black text-[#1DB954] bg-[#FFFBF7]">
                    ✓ Clean broadcast copy with 1-click test link
                  </td>
                </tr>
                <tr className="bg-[#F8F7F2] font-black">
                  <td className="py-4 px-4 text-[#1A1A1A]">Total Time Per Product</td>
                  <td className="py-4 px-4 text-[#DC2626]">2 to 3 Hours per post</td>
                  <td className="py-4 px-4 text-[#FF6B00] bg-[#FFFBF7] rounded-b-xl text-base">
                    Under 60 Seconds
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. WHO IS AFRICUT SELL BUILT FOR? */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-black tracking-widest text-[#FF6B00] mb-2 inline-block">
            Tailored For Your Business
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A]">
            Built for everyday African merchants
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2">
            Whether you sell from your kitchen, physical boutique, or online store, AfriCut writes in your business tone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Bakers & Caterers",
              desc: "Highlight cake layers, fresh buttercream swirls, dessert tables, and pre-order dates for weddings and birthdays.",
              tag: "Celebrations & Pre-orders",
              icon: "🎂",
            },
            {
              title: "Fashion & Ankara Boutiques",
              desc: "Showcase fabric drape, 2-piece twirls, size fittings, stitching details, and nationwide dispatch timelines.",
              tag: "Dresses & Ready-to-Wear",
              icon: "👗",
            },
            {
              title: "Thrift & Sneaker Sellers",
              desc: "Point out Grade-A shoe sole condition, vintage denim washes, exact size availability, and limited restock slots.",
              tag: "Quick Restocks & Snags",
              icon: "👟",
            },
            {
              title: "Beauty & Hair Vendors",
              desc: "Demonstrate wig luster, skin glow routine results, HD lace melting, and genuine customer transformations.",
              tag: "Glow & Hair Units",
              icon: "✨",
            },
            {
              title: "Phones & Gadgets Dealers",
              desc: "Show unboxings, camera zoom tests, battery health percentages, and warranty terms for confident buyers.",
              tag: "Tech & Accessories",
              icon: "📱",
            },
            {
              title: "Food & Jollof Kitchens",
              desc: "Capture sizzling grills, smoky party jollof trays, lunch delivery packaging, and weekend party bookings.",
              tag: "Daily Lunch & Catering",
              icon: "🍲",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-6 shadow-[3px_3px_0px_0px_#1A1A1A] hover:shadow-[5px_5px_0px_0px_#FF6B00] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#F8F7F2] text-[#1A1A1A] border border-[#1A1A1A] px-2.5 py-1 rounded-md">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. REAL SELLER STORIES / REVIEWS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24">
        <div className="bg-[#F8F7F2] rounded-3xl border-2 border-[#1A1A1A] p-6 sm:p-10 shadow-[4px_4px_0px_0px_#1A1A1A]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-black tracking-widest text-[#FF6B00] mb-2 inline-block">
              Real Merchant Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">
              Loved by busy vendors across Lagos, Abuja & Nairobi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-6 shadow-[3px_3px_0px_0px_#1A1A1A]">
              <div className="flex items-center gap-1 text-[#FF6B00] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF6B00]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium italic mb-4 leading-relaxed">
                "I used to spend 2 hours after baking trying to figure out what to write on Instagram. AfriCut gave me the exact words and a WhatsApp order link. My weekend orders doubled!"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#FDF2EB] border-2 border-[#1A1A1A] flex items-center justify-center font-black text-sm text-[#FF6B00]">
                  CB
                </div>
                <div>
                  <div className="text-xs font-black text-[#1A1A1A]">Chidinma B.</div>
                  <div className="text-[11px] text-gray-500 font-medium">Boutique Baker, Lekki Lagos</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-6 shadow-[3px_3px_0px_0px_#1A1A1A]">
              <div className="flex items-center gap-1 text-[#FF6B00] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF6B00]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium italic mb-4 leading-relaxed">
                "The 3 hook options are genius. I tested Hook 01 on TikTok and got 14,000 views and 28 direct WhatsApp messages for my Ankara sets within 24 hours."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#FDF2EB] border-2 border-[#1A1A1A] flex items-center justify-center font-black text-sm text-[#FF6B00]">
                  KO
                </div>
                <div>
                  <div className="text-xs font-black text-[#1A1A1A]">Kemi O.</div>
                  <div className="text-[11px] text-gray-500 font-medium">Fashion Designer, Yaba</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-6 shadow-[3px_3px_0px_0px_#1A1A1A]">
              <div className="flex items-center gap-1 text-[#FF6B00] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF6B00]" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium italic mb-4 leading-relaxed">
                "Posting on WhatsApp status used to be a hassle. Now I just copy the generated status broadcast and paste. My regular customers reply instantly to claim stock."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#FDF2EB] border-2 border-[#1A1A1A] flex items-center justify-center font-black text-sm text-[#FF6B00]">
                  EN
                </div>
                <div>
                  <div className="text-xs font-black text-[#1A1A1A]">Emeka N.</div>
                  <div className="text-[11px] text-gray-500 font-medium">Gadgets Store, Ikeja</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MERCHANT FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-black tracking-widest text-[#FF6B00] mb-2 inline-block">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A]">
            Everything you need to know
          </h2>
        </div>

        <div className="space-y-3.5">
          {[
            {
              q: "Do I need any video editing experience to use AfriCut Sell?",
              a: "Not at all! AfriCut is built specifically for sellers who don't know how to edit videos or don't have time. Simply upload your raw phone video as it is. Our system scans the clip, identifies the best 20–45s selling moment, and writes all the captions and on-screen text for you.",
            },
            {
              q: "How does the direct WhatsApp order link help my sales?",
              a: "When you post your selling kit, AfriCut formats a ready-to-use WhatsApp broadcast and link. When a customer taps it, it automatically opens a chat with you containing a polite, pre-filled order inquiry (e.g. 'Hi Chidinma, I want to order the celebration cake from your status'). This removes friction and makes customers order faster.",
            },
            {
              q: "What if my video is shaky or has background noise?",
              a: "That's completely fine! Most social commerce sales happen on raw, authentic phone footage because buyers trust real videos over staged ads. AfriCut provides timed on-screen text overlays so viewers who watch on mute still understand the price, benefits, and how to order.",
            },
            {
              q: "Can I use the generated content across Instagram, TikTok, and WhatsApp?",
              a: "Yes! Every selling kit includes 3 separate platform formats: storytelling captions for Instagram Reels, quick punchy scripts for TikTok, and structured bulleted copy for WhatsApp Status.",
            },
            {
              q: "What video length works best?",
              a: "We recommend uploading a 30-second to 2-minute raw video from your camera roll. AfriCut will automatically pinpoint the exact 20–45s window with the highest visual payoff.",
            },
            {
              q: "Can I save and reuse my selling kits later?",
              a: "Yes, you can save your generated selling kits to your workspace with one click. You can duplicate them for restocks or weekend flash sales anytime.",
            },
          ].map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-[#1A1A1A] p-5 shadow-[2px_2px_0px_0px_#1A1A1A] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-black text-[#1A1A1A]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF6B00] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mt-3 pt-3 border-t border-gray-100 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BOTTOM ACTION CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24 text-center">
        <div className="bg-[#1A1A1A] rounded-3xl p-8 sm:p-14 text-white border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#FF6B00] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Ready to turn your phone videos into daily sales?
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8 text-sm sm:text-base font-medium leading-relaxed">
            No video editing skills needed. Upload one clip, tell us what you sell, and get your complete social selling kit in under 60 seconds.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-black text-base sm:text-lg px-9 py-4 rounded-2xl border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Make My Selling Kit Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
