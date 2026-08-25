import { SalesBrief, SalesContentPack, Project } from "../types";
import { CHIDINMA_CAKES_PACK } from "../data/presets";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  suggestedAction?: {
    action: "UPDATE_HOOKS" | "UPDATE_CAPTION" | "UPDATE_WHATSAPP" | "UPDATE_MOMENT";
    [key: string]: any;
  } | null;
}

export async function askAiConsultant(params: {
  messages: Array<{ role: "user" | "model"; content: string }>;
  activePack?: SalesContentPack | null;
  savedProjects?: Project[];
  userQuery?: string;
}): Promise<{ reply: string; suggestedAction?: any }> {
  try {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return {
      reply: data.reply,
      suggestedAction: data.suggestedAction,
    };
  } catch (error) {
    console.warn("AI Chat API call failed, providing local consultant advice:", error);
    return {
      reply: "Here is a high-converting tip for African social commerce: Always add the price and clear delivery terms on your WhatsApp status and Instagram captions. When customers know the cost upfront, the people who click your WhatsApp link are ready to pay immediately!",
      suggestedAction: null,
    };
  }
}

export async function quickAiEdit(params: {
  pack: SalesContentPack;
  field: "hooks" | "captions" | "whatsapp" | "overlays" | "bestMoment";
  instruction: string;
}): Promise<any> {
  try {
    const response = await fetch("/api/ai-quick-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error("Failed to edit");
    const data = await response.json();
    return data.updatedData;
  } catch (err) {
    console.warn("Quick edit failed:", err);
    return null;
  }
}

export async function generateSalesContentPack(brief: SalesBrief): Promise<SalesContentPack> {
  try {
    const response = await fetch("/api/generate-sales-pack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brief }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.pack) {
      return data.pack;
    }
    throw new Error("Invalid response format from server");
  } catch (error) {
    console.warn("API request failed, generating client-side heuristic pack:", error);
    // Client-side fallback if fetch fails or network issue
    return createClientFallbackPack(brief);
  }
}

function createClientFallbackPack(brief: SalesBrief): SalesContentPack {
  const isChidinma = brief.productTitle?.toLowerCase().includes("cake") || brief.category?.toLowerCase().includes("food");
  if (isChidinma) {
    return {
      ...CHIDINMA_CAKES_PACK,
      id: "pack-" + Date.now(),
      brief: { ...brief },
      generatedAt: new Date().toISOString(),
    };
  }

  const category = brief.category || "General Products";
  const title = brief.productTitle || "Featured Product";
  const benefit = brief.mainBenefit || "High quality and unique craftsmanship";
  const cta = brief.cta || "Send us a WhatsApp message to order";
  const location = brief.location || "Lagos / Nationwide delivery";

  return {
    id: "pack-" + Date.now(),
    brief,
    bestMoment: {
      startTime: "00:08",
      endTime: "00:38",
      durationSeconds: 30,
      rationale: `Highlights the most impactful 30s highlight window demonstrating ${title} and emphasizing ${benefit}.`,
      visualCue: "Product in action with clear texture, finish, and packaging details.",
    },
    hooks: [
      {
        id: "hook-1",
        hookNumber: "Hook 01",
        text: `Stop scrolling if you need ${title} that actually delivers on quality and durability.`,
        style: "Emotional / Problem",
        whyItWorks: "Directly calls out buyer skepticism and promises dependable value.",
      },
      {
        id: "hook-2",
        hookNumber: "Hook 02",
        text: `Looking for ${title} everyone will be asking you about?`,
        style: "Curiosity",
        whyItWorks: "Triggers social admiration and curiosity.",
      },
      {
        id: "hook-3",
        hookNumber: "Hook 03",
        text: `Crafted with care. Made for you. Limited stock available now in ${location}.`,
        style: "Direct Benefit / Offer",
        whyItWorks: "Creates clean urgency and direct purchase incentive.",
      },
    ],
    captionOverlays: [
      {
        id: "ov-1",
        startTime: "00:00",
        endTime: "00:06",
        text: `The ${title} you've been waiting for ✨`,
        purpose: "Hook / Attention",
      },
      {
        id: "ov-2",
        startTime: "00:06",
        endTime: "00:14",
        text: `${benefit}`,
        purpose: "Feature / Detail",
      },
      {
        id: "ov-3",
        startTime: "00:14",
        endTime: "00:22",
        text: `Trusted by happy customers across ${location}`,
        purpose: "Social Proof / Value",
      },
      {
        id: "ov-4",
        startTime: "00:22",
        endTime: "00:30",
        text: `Limited stock available this week ⚡`,
        purpose: "Urgency / Offer",
      },
      {
        id: "ov-5",
        startTime: "00:30",
        endTime: "00:38",
        text: `${cta} 👉 Tap link in bio`,
        purpose: "Final CTA",
      },
    ],
    styleRecommendation: {
      duration: "25-30 seconds",
      pacing: "3s Hook → 18s Dynamic Showcase → 7s Strong CTA",
      captionStyle: "Large high-contrast text with punchy 4-word phrasing",
      visualTreatment: "Clean cuts with natural daylight and macro product close-ups",
      mood: brief.tone || "Premium & Warm",
      rationale: `Shorter, high-energy cuts maximize watch time and DM conversions for ${category}.`,
    },
    platformCaptions: [
      {
        platform: "Instagram Reels",
        caption: `✨ Ready to elevate your daily routine? Our ${title} is officially restocked!\n\n${benefit}.\n\n📍 Delivery: ${location}\n⚡ Limited slots available this week\n\n👉 ${cta} or tap link in bio to order now!`,
        hashtags: ["#AfricanBusiness", `#${category.replace(/[^a-zA-Z]/g, "")}`, "#ShopLocal", "#AfriCutSell"],
        cta: `${cta} via link in bio!`,
        tips: "Pin your WhatsApp catalog link or booking contact in the top comment.",
      },
      {
        platform: "TikTok",
        caption: `Wait for the reveal 😍 This ${title} is worth every penny! Comment or WhatsApp to order today 💬 #smallbiz #africantiktok`,
        hashtags: ["#TikTokMadeMeBuyIt", "#SmallBusinessCheck", "#fyp"],
        cta: "WhatsApp us directly to order!",
        tips: "Use a trending soundtrack and answer the first 5 customer comments within 30 minutes.",
      },
      {
        platform: "WhatsApp Status",
        caption: `✨ *NEW STOCK: ${title.toUpperCase()}*\n\n• ${benefit}\n• Fast delivery in ${location}\n\n💬 *Reply to this status to place your order now!*`,
        hashtags: [],
        cta: "Reply to this status to order.",
        tips: "Post the video highlight as Slide 1 and the price list as Slide 2.",
      },
    ],
    whatsappStatus: {
      text: `✨ *${title} Available Now*\n${benefit}.\n\nReply to this status to order! 👇`,
      suggestedEmoji: "✨",
      directOrderPrompt: `Hello! I saw your ${title} video on WhatsApp Status and would like to order.`,
    },
    hashtags: ["#AfricanBusiness", "#SmallBizAfrica", "#ShopSmall", `#${category.replace(/[^a-zA-Z]/g, "")}`, "#AfriCutSell"],
    primaryCta: `${cta}.`,
    generatedAt: new Date().toISOString(),
    aiEngine: "Dala Studio v2.4 (Local Sales Engine)",
  };
}
