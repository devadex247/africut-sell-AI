import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client server-side with required User-Agent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AfriCut Sell",
    version: "2.5.0",
    engine: "Dala Studio (Powered by Gemini 3.7 Flash AI)",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// AI Chat Assistant endpoint for Dala AI Sales Consultant
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { messages, activePack, savedProjects, userQuery } = req.body;

    const client = getGeminiClient();

    // Prepare rich context about the active pack and saved projects
    const activePackContext = activePack
      ? `
Active Social Selling Kit in View:
- Product Name: "${activePack.brief.productTitle}"
- Category: "${activePack.brief.category}"
- Main Benefit: "${activePack.brief.mainBenefit}"
- Sales Goal: "${activePack.brief.salesGoal}"
- Desired Tone: "${activePack.brief.tone}"
- Target Channels: ${activePack.brief.platforms?.join(", ")}
- Location: "${activePack.brief.location || "Nationwide Delivery"}"
- Price Note: "${activePack.brief.priceNote || "Not specified"}"
- Current Highlight Window: ${activePack.bestMoment.startTime} - ${activePack.bestMoment.endTime} (${activePack.bestMoment.rationale})
- Current Hooks:
${activePack.hooks.map((h: any, i: number) => `  ${i + 1}. [${h.style}] "${h.text}" (${h.whyItWorks})`).join("\n")}
- Current Primary CTA: "${activePack.primaryCta}"
- WhatsApp Status Broadcast: "${activePack.whatsappStatus?.text}"
- Instagram Caption Preview: "${activePack.platformCaptions?.find((p: any) => p.platform === "Instagram Reels")?.caption?.slice(0, 150)}..."
`
      : "No active kit currently opened.";

    const savedProjectsContext =
      savedProjects && savedProjects.length > 0
        ? `
Seller's Saved Projects Base (${savedProjects.length} total kits):
${savedProjects
  .map(
    (p: any, i: number) =>
      `${i + 1}. "${p.name}" (${p.brief.category}) - Goal: ${p.brief.salesGoal}, Location: ${p.brief.location || "N/A"}, Hooks: "${p.pack?.hooks?.[0]?.text || "N/A"}"`
  )
  .join("\n")}
`
        : "No saved projects yet.";

    const systemInstruction = `You are "Dala AI Sales Consultant", the specialized African social commerce AI assistant built inside AfriCut Sell.
You help African micro and small merchants (bakers, fashion designers, skincare makers, wig stylists, gadget vendors, thrift sellers in Lagos, Abuja, Nairobi, Accra, Johannesburg, etc.) maximize their sales on Instagram Reels, TikTok, and WhatsApp.

You have full knowledge of the user's active kit and all their saved projects.
When answering:
1. Provide punchy, authentic, highly actionable advice (incorporate Nigerian Pidgin, Ghanaian English, Sheng, or African vendor slang if appropriate or requested).
2. Understand African buyer psychology: addressing skepticism about pay-on-delivery vs payment before dispatch, handling "How much?" comments in DMs, creating urgency for weekend stock, crafting WhatsApp broadcasts that don't get blocked, and framing video hooks in the first 2 seconds.
3. If the user asks to edit, rewrite, improve, or suggest new hooks, captions, timed overlays, or video moment timestamps for the active kit, provide your conversational explanation AND include a structured JSON action block so the app can offer a 1-click "Apply to Kit" button!

Format the action block inside a \`\`\`json-action ... \`\`\` code fence with one of these structures:

For Hook update or suggestions:
\`\`\`json-action
{
  "action": "UPDATE_HOOKS",
  "hooks": [
    { "id": "hook-1", "hookNumber": "Hook 01", "text": "...", "style": "Curiosity", "whyItWorks": "..." },
    { "id": "hook-2", "hookNumber": "Hook 02", "text": "...", "style": "Emotional / Problem", "whyItWorks": "..." },
    { "id": "hook-3", "hookNumber": "Hook 03", "text": "...", "style": "Direct Benefit / Offer", "whyItWorks": "..." }
  ]
}
\`\`\`

For Caption update:
\`\`\`json-action
{
  "action": "UPDATE_CAPTION",
  "platform": "Instagram Reels", // or "TikTok" or "WhatsApp Status"
  "caption": "...",
  "hashtags": ["#Tag1", "#Tag2"],
  "cta": "..."
}
\`\`\`

For WhatsApp Status broadcast update:
\`\`\`json-action
{
  "action": "UPDATE_WHATSAPP",
  "text": "...",
  "directOrderPrompt": "..."
}
\`\`\`

For Highlight Moment update:
\`\`\`json-action
{
  "action": "UPDATE_MOMENT",
  "startTime": "00:10",
  "endTime": "00:38",
  "durationSeconds": 28,
  "rationale": "...",
  "visualCue": "..."
}
\`\`\`

Be warm, sharp, commercially minded, and encouraging. Always focus on getting real paying customers into WhatsApp or DMs.`;

    if (client) {
      // Build conversation contents
      const conversationHistory = (messages || []).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content || m.text }],
      }));

      // Append current user query with context
      const queryWithContext = `User Query: "${userQuery || messages[messages.length - 1]?.content || "Help me sell more"}"

Context:
${activePackContext}
${savedProjectsContext}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          ...conversationHistory.slice(0, -1),
          { role: "user", parts: [{ text: queryWithContext }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I am ready to help you optimize your selling kit and get more customer orders!";

      // Extract optional json-action
      let suggestedAction = null;
      const actionMatch = replyText.match(/```json-action\s*([\s\S]*?)\s*```/);
      if (actionMatch) {
        try {
          suggestedAction = JSON.parse(actionMatch[1]);
        } catch (e) {
          console.warn("Failed to parse json-action block:", e);
        }
      }

      // Clean display text without raw json-action block for pristine reading
      const cleanReply = replyText.replace(/```json-action[\s\S]*?```/g, "").trim();

      return res.json({
        success: true,
        reply: cleanReply || replyText,
        suggestedAction,
      });
    }

    // Heuristic Fallback chat consultant
    const fallbackReply = generateFallbackChatReply(userQuery || "", activePack, savedProjects);
    return res.json({
      success: true,
      reply: fallbackReply.text,
      suggestedAction: fallbackReply.action,
    });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    return res.json({
      success: true,
      reply: "I'm right here to help! To increase your sales on WhatsApp and Instagram, make sure your first 3 seconds call out a specific buyer desire or solve a common pain point, and always tell customers exactly what to type when they message you.",
      suggestedAction: null,
    });
  }
});

// Quick AI Rewriter for specific sections (Hooks, Pidgin, Urgency, Captions)
app.post("/api/ai-quick-edit", async (req, res) => {
  try {
    const { pack, field, instruction } = req.body;
    const client = getGeminiClient();

    if (client && pack) {
      const prompt = `You are Dala Studio AI Sales Engine.
Product: "${pack.brief.productTitle}" (${pack.brief.category})
Main Benefit: "${pack.brief.mainBenefit}"
Sales Goal: "${pack.brief.salesGoal}"
Target Field: "${field}"
User Request / Modification Instruction: "${instruction}"

Generate the revised content for "${field}" in valid JSON.
If field is "hooks", return JSON: { "hooks": [{ "id": "hook-1", "hookNumber": "Hook 01", "text": "...", "style": "...", "whyItWorks": "..." }, ...] }
If field is "captions", return JSON: { "platformCaptions": [{ "platform": "Instagram Reels", "caption": "...", "hashtags": [...], "cta": "..." }, ...] }
If field is "whatsapp", return JSON: { "whatsappStatus": { "text": "...", "suggestedEmoji": "✨", "directOrderPrompt": "..." }, "primaryCta": "..." }
If field is "overlays", return JSON: { "captionOverlays": [{ "id": "ov-1", "startTime": "00:00", "endTime": "00:06", "text": "...", "purpose": "Hook / Attention" }, ...] }
If field is "bestMoment", return JSON: { "bestMoment": { "startTime": "00:10", "endTime": "00:38", "durationSeconds": 28, "rationale": "...", "visualCue": "..." } }`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are Dala Studio AI. Respond with valid JSON matching requested field format.",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, updatedData: parsed });
    }

    return res.json({ success: true, updatedData: {} });
  } catch (err) {
    console.error("Quick edit error:", err);
    return res.status(500).json({ error: "Failed to perform quick edit" });
  }
});

function generateFallbackChatReply(query: string, activePack: any, savedProjects: any[]) {
  const q = query.toLowerCase();

  if (q.includes("hook") || q.includes("opener") || q.includes("scroll")) {
    const title = activePack?.brief?.productTitle || "your product";
    return {
      text: `Here are 3 high-energy hook alternatives for **${title}** designed to immediately halt scrollers in the first 2 seconds:\n\n1. 🔥 **Problem-Trigger**: "If you're tired of spending money on ${title} that doesn't last, you need to see this."\n2. ✨ **Social Curiosity**: "POV: You found the exact ${title} that everyone in Lagos has been gatekeeping."\n3. ⚡ **Direct Deal**: "Fresh batch alert: Handcrafted quality, fast nationwide dispatch, and limited slots this week!"`,
      action: activePack
        ? {
            action: "UPDATE_HOOKS",
            hooks: [
              {
                id: "hook-ai-1",
                hookNumber: "Hook 01 (Urgent)",
                text: `If you're tired of wasting money on low quality, this ${title} was made for you.`,
                style: "Emotional / Problem",
                whyItWorks: "Directly overcomes buyer skepticism.",
              },
              {
                id: "hook-ai-2",
                hookNumber: "Hook 02 (Curiosity)",
                text: `POV: You found the exact ${title} everyone has been asking you about.`,
                style: "Curiosity",
                whyItWorks: "High social proof and FOMO trigger.",
              },
              {
                id: "hook-ai-3",
                hookNumber: "Hook 03 (Direct)",
                text: `Main character energy loaded. Limited slots available in this restock!`,
                style: "Direct Benefit / Offer",
                whyItWorks: "Fast impulse action trigger.",
              },
            ],
          }
        : null,
    };
  }

  if (q.includes("pidgin") || q.includes("naija") || q.includes("local")) {
    const title = activePack?.brief?.productTitle || "this product";
    return {
      text: `Oya! Here is a super relatable, high-converting Nigerian Pidgin & English caption that will make your followers rush to WhatsApp:\n\n"No be small thing oh! 🔥 When we talk say quality choke, this ${title} na confirmed proof. Dem say good things no dey hide, and this new stock no go last for shelf at all! 📦\n\n📍 We dey deliver sharp sharp nationwide!\n👉 Send us a DM or tap WhatsApp link make we keep your own before e finish!"`,
      action: activePack
        ? {
            action: "UPDATE_CAPTION",
            platform: "Instagram Reels",
            caption: `No be small thing oh! 🔥 When we talk say quality choke, our ${title} na confirmed proof! ✨\n\nPure top-grade craftsmanship, zero compromise on standards. If you want something that gives premium vibes every single time, this is it.\n\n📍 Delivery: Nationwide dispatch\n⚡ Limited stock available this week!\n\n👉 Send us a WhatsApp message to lock your order sharp sharp!`,
            hashtags: ["#NaijaBusiness", "#LagosVendor", "#QualityAssured", "#AfriCutSell"],
            cta: "Send us a WhatsApp message sharp sharp to order!",
          }
        : null,
    };
  }

  if (q.includes("whatsapp") || q.includes("broadcast") || q.includes("status")) {
    const title = activePack?.brief?.productTitle || "your featured product";
    return {
      text: `For WhatsApp Status, never just post a plain photo! Use a 3-slide sequence:\n\n📱 **Slide 1**: 15s Video clip with catchy on-screen words.\n📱 **Slide 2**: Price & specifications with clear delivery timeline.\n📱 **Slide 3**: Call to action asking them to "Reply with your delivery city to order".\n\nHere is an optimized broadcast message you can send to your customer broadcast list:`,
      action: activePack
        ? {
            action: "UPDATE_WHATSAPP",
            text: `✨ *WEEKEND STOCK UPDATE: ${title.toUpperCase()}*\n\nHey dear! We just restocked our bestselling ${title}. Only limited pieces are available before this batch closes.\n\n🚚 Fast delivery in 24-48 hours.\n💬 *Reply to this message with your location to claim yours today!*`,
            directOrderPrompt: `Hello! I would like to order ${title} from your weekend update.`,
          }
        : null,
    };
  }

  return {
    text: `Hello! I am your **Dala AI Sales Consultant**. I can analyze your active selling kit for **${activePack?.brief?.productTitle || "your products"}** and your ${savedProjects?.length || 0} saved projects.\n\nTry asking me:\n• *"Rewrite my hooks to make them 3x more urgent"*\n• *"Give me an Instagram caption with Nigerian Pidgin / Naija vibes"*\n• *"How do I handle 'How much?' commenters in my DMs?"*\n• *"Suggest a 3-slide WhatsApp Status broadcast strategy"*\n• *"Suggest a better highlight timestamp for my product video"*`,
    action: null,
  };
}

// Real AI Generation Endpoint for AfriCut Sales Content Pack
app.post("/api/generate-sales-pack", async (req, res) => {
  try {
    const { brief } = req.body;

    if (!brief || !brief.productTitle || !brief.category) {
      return res.status(400).json({ error: "Missing required brief information." });
    }

    const client = getGeminiClient();

    // If Gemini key is available, use Gemini 3.7 Flash for deep context reasoning
    if (client) {
      const prompt = `You are Dala Studio AI Sales Engine for AfriCut Sell, an AI sales-content assistant built specifically for African micro and small businesses (selling in Lagos, Abuja, Nairobi, Accra, Johannesburg, etc.) through Instagram, TikTok, and WhatsApp.

Analyze the seller's product context and generate a complete, high-converting Sales Content Pack tailored to their target audience and channels.

Seller Context:
- Product Name / Title: "${brief.productTitle}"
- Category: "${brief.category}"
- Main Benefit / Unique Selling Point: "${brief.mainBenefit || "High quality craftsmanship"}"
- Primary Sales Goal: "${brief.salesGoal || "Get WhatsApp orders"}"
- Target Platforms: ${(brief.platforms || ["Instagram Reels", "TikTok", "WhatsApp Status"]).join(", ")}
- Desired Tone: "${brief.tone || "Premium & Warm"}"
- Call to Action (CTA): "${brief.cta || "Send us a WhatsApp message"}"
- Location / Coverage: "${brief.location || "Nationwide delivery"}"
- Estimated Video Duration: ${brief.videoDuration ? `${brief.videoDuration} seconds` : "approx 60 seconds raw video"}

Generate a JSON object matching this exact schema:
{
  "bestMoment": {
    "startTime": "00:10",
    "endTime": "00:42",
    "durationSeconds": 32,
    "rationale": "Detailed explanation of why this 20-45s highlight window captures customer attention and reveals product value.",
    "visualCue": "Visual cue of what happens in this clip (e.g. dramatic reveal, application, angle turn)."
  },
  "hooks": [
    {
      "id": "hook-1",
      "hookNumber": "Hook 01",
      "text": "First compelling hook line designed to stop social media scrolling in 1.5 seconds.",
      "style": "Emotional / Problem",
      "whyItWorks": "Explanation of psychological sales trigger."
    },
    {
      "id": "hook-2",
      "hookNumber": "Hook 02",
      "text": "Second curiosity or social proof hook line.",
      "style": "Curiosity",
      "whyItWorks": "Why it sparks intrigue."
    },
    {
      "id": "hook-3",
      "hookNumber": "Hook 03",
      "text": "Third direct offer / value hook line.",
      "style": "Direct Benefit / Offer",
      "whyItWorks": "Why it drives immediate action."
    }
  ],
  "captionOverlays": [
    {
      "id": "overlay-1",
      "startTime": "00:00",
      "endTime": "00:06",
      "text": "Short punchy on-screen text 1 (Hook)",
      "purpose": "Hook / Attention"
    },
    {
      "id": "overlay-2",
      "startTime": "00:06",
      "endTime": "00:14",
      "text": "Short punchy on-screen text 2 (Detail/Feature)",
      "purpose": "Feature / Detail"
    },
    {
      "id": "overlay-3",
      "startTime": "00:14",
      "endTime": "00:22",
      "text": "Short punchy on-screen text 3 (Social proof/Benefit)",
      "purpose": "Social Proof / Value"
    },
    {
      "id": "overlay-4",
      "startTime": "00:22",
      "endTime": "00:32",
      "text": "Short punchy on-screen text 4 (Urgency/Offer)",
      "purpose": "Urgency / Offer"
    },
    {
      "id": "overlay-5",
      "startTime": "00:32",
      "endTime": "00:42",
      "text": "Short punchy on-screen text 5 (Clear CTA)",
      "purpose": "Final CTA"
    }
  ],
  "styleRecommendation": {
    "duration": "25-35 seconds",
    "pacing": "Detailed pacing breakdown (e.g. 3s opening hook → 18s close-up showcase → 7s CTA)",
    "captionStyle": "Recommendation for typography, contrast and colors",
    "visualTreatment": "Camera angles, lighting and cut advice",
    "mood": "Tone and musical atmosphere recommendation",
    "rationale": "Why this video style converts best for ${brief.category}"
  },
  "platformCaptions": [
    {
      "platform": "Instagram Reels",
      "caption": "Complete ready-to-post Instagram caption with line breaks, emojis, storytelling, location mention, and clear CTA.",
      "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3", "#Hashtag4", "#Hashtag5"],
      "cta": "Specific Instagram CTA",
      "tips": "Pro posting tip for Instagram Reels"
    },
    {
      "platform": "TikTok",
      "caption": "Punchy, relatable TikTok caption with engagement question and trending format.",
      "hashtags": ["#TikTokTag1", "#TikTokTag2", "#fyp"],
      "cta": "TikTok specific CTA",
      "tips": "Pro posting tip for TikTok"
    },
    {
      "platform": "WhatsApp Status",
      "caption": "High-converting formatted WhatsApp Status broadcast with asterisks for bolding, bullet points, and instant reply prompt.",
      "hashtags": [],
      "cta": "Reply to this status to order",
      "tips": "Pro tip for WhatsApp status sequence"
    }
  ],
  "whatsappStatus": {
    "text": "Direct WhatsApp status text ready to copy with emojis and clear order instructions.",
    "suggestedEmoji": "✨",
    "directOrderPrompt": "Pre-filled WhatsApp message customer can send to seller."
  },
  "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3", "#Hashtag4", "#Hashtag5", "#AfriCutSell"],
  "primaryCta": "${brief.cta || "Send us a WhatsApp message to order."}"
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction:
            "You are Dala Studio AI Sales Engine for AfriCut Sell. Always respond with pure valid JSON matching the requested schema. Ensure authentic, high-converting copy that sounds like a real, successful African social commerce entrepreneur rather than generic corporate text.",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      const fullPack = {
        id: "pack-" + Date.now(),
        brief,
        bestMoment: parsedData.bestMoment || {
          startTime: "00:08",
          endTime: "00:38",
          durationSeconds: 30,
          rationale: `Optimal 30s highlight highlighting the key benefits of ${brief.productTitle}.`,
          visualCue: "Product showcase and key feature demonstration.",
        },
        hooks: parsedData.hooks || [],
        captionOverlays: parsedData.captionOverlays || [],
        styleRecommendation: parsedData.styleRecommendation || {
          duration: "30 seconds",
          pacing: "Fast opening → clear showcase → direct CTA",
          captionStyle: "High contrast bold text",
          visualTreatment: "Clean cuts with natural lighting",
          mood: brief.tone || "Premium & Warm",
          rationale: "Optimized for social engagement.",
        },
        platformCaptions: parsedData.platformCaptions || [],
        whatsappStatus: parsedData.whatsappStatus || {
          text: `✨ *${brief.productTitle} Available Now*\n${brief.mainBenefit}\n\n👉 Send a message to order today!`,
          suggestedEmoji: "✨",
          directOrderPrompt: `Hello! I would like to inquire about ordering ${brief.productTitle}.`,
        },
        hashtags: parsedData.hashtags || ["#SupportLocal", "#AfricanBusiness", "#AfriCutSell"],
        primaryCta: parsedData.primaryCta || brief.cta || "Send a WhatsApp message to order.",
        generatedAt: new Date().toISOString(),
        aiEngine: "Dala Studio v2.4 (Powered by Gemini 3.7 Flash)",
      };

      return res.json({ success: true, pack: fullPack });
    }

    // Heuristic Fallback generator if no GEMINI_API_KEY is present
    const fallbackPack = generateHeuristicPack(brief);
    return res.json({ success: true, pack: fallbackPack });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    // On any failure, return high-quality heuristic generated pack so the user flow never breaks
    const fallbackPack = generateHeuristicPack(req.body?.brief || {});
    return res.json({ success: true, pack: fallbackPack, notice: "Generated with local Dala heuristic engine." });
  }
});

function generateHeuristicPack(brief: any) {
  const category = brief.category || "General Products";
  const title = brief.productTitle || "Featured Product";
  const benefit = brief.mainBenefit || "Top-grade quality and handcrafted excellence";
  const goal = brief.salesGoal || "Get WhatsApp orders";
  const location = brief.location || "Nationwide Delivery";
  const cta = brief.cta || "Send us a WhatsApp message to order";
  const tone = brief.tone || "Premium & Warm";

  const isBakery = category.toLowerCase().includes("food") || category.toLowerCase().includes("cake") || category.toLowerCase().includes("bak");
  const isFashion = category.toLowerCase().includes("fashion") || category.toLowerCase().includes("cloth") || category.toLowerCase().includes("wear");
  const isBeauty = category.toLowerCase().includes("beauty") || category.toLowerCase().includes("skin") || category.toLowerCase().includes("hair");

  return {
    id: "pack-" + Date.now(),
    brief,
    bestMoment: {
      startTime: isBakery ? "00:10" : isFashion ? "00:08" : "00:05",
      endTime: isBakery ? "00:42" : isFashion ? "00:36" : "00:32",
      durationSeconds: isBakery ? 32 : isFashion ? 28 : 27,
      rationale: `Highlights the most impactful 25-35s window showing ${title} in action, highlighting ${benefit}, and establishing strong visual credibility before the closing CTA.`,
      visualCue: isBakery ? "Close-up textural reveal and packaging box unveil." : isFashion ? "Movement spin and silhouette styling change." : "Product application and smooth natural finish.",
    },
    hooks: [
      {
        id: "hook-1",
        hookNumber: "Hook 01",
        text: isBakery
          ? "Your next celebration deserves more than an ordinary cake."
          : isFashion
          ? "Stop scrolling if you need an outfit that turns heads effortlessly."
          : isBeauty
          ? "If you want real natural glow without harsh bleaching chemicals, watch this."
          : `Looking for ${title} that actually delivers on quality?`,
        style: "Emotional / Problem" as const,
        whyItWorks: "Directly engages target desire and sets high perceived value in the first 2 seconds.",
      },
      {
        id: "hook-2",
        hookNumber: "Hook 02",
        text: isBakery
          ? "Looking for a cake they'll actually talk about after the party?"
          : isFashion
          ? "POV: You found the piece that fits your body perfectly without alterations."
          : isBeauty
          ? "My daily routine in 3 simple steps with pure botanical extracts."
          : `Why everyone is upgrading to this ${title} this season.`,
        style: "Curiosity" as const,
        whyItWorks: "Taps into curiosity and social proof, sparking high retention.",
      },
      {
        id: "hook-3",
        hookNumber: "Hook 03",
        text: isBakery
          ? "Made fresh. Made personal. Made for your special milestone."
          : isFashion
          ? "Main character energy loaded. Limited edition pieces available now."
          : isBeauty
          ? "100% natural, deep hydration, and visible results in 14 days."
          : `Fresh stock alert: ${benefit}. Order yours before we sell out.`,
        style: "Direct Benefit / Offer" as const,
        whyItWorks: "Clear benefit formulation that converts motivated buyers quickly.",
      },
    ],
    captionOverlays: [
      {
        id: "ov-1",
        startTime: "00:00",
        endTime: "00:06",
        text: `Crafted for your special moments ✨`,
        purpose: "Hook / Attention" as const,
      },
      {
        id: "ov-2",
        startTime: "00:06",
        endTime: "00:14",
        text: `${benefit}`,
        purpose: "Feature / Detail" as const,
      },
      {
        id: "ov-3",
        startTime: "00:14",
        endTime: "00:22",
        text: `Top rated by happy customers in ${location}`,
        purpose: "Social Proof / Value" as const,
      },
      {
        id: "ov-4",
        startTime: "00:22",
        endTime: "00:30",
        text: `Limited stock / Pre-order your slot early`,
        purpose: "Urgency / Offer" as const,
      },
      {
        id: "ov-5",
        startTime: "00:30",
        endTime: "00:38",
        text: `${cta} 👉 Tap link in bio`,
        purpose: "Final CTA" as const,
      },
    ],
    styleRecommendation: {
      duration: "30 seconds",
      pacing: "Fast opening hook (3s) → detailed product showcase (20s) → clear CTA (7s)",
      captionStyle: "Large, high-contrast captions with punchy phrases and bright accent borders",
      visualTreatment: "Clean product-focused cuts, warm daylight lighting, and steady macro angles",
      mood: tone,
      rationale: `For ${category}, dynamic pacing with clear benefit callouts prevents scroll-aways and drives high DM conversion.`,
    },
    platformCaptions: [
      {
        platform: "Instagram Reels",
        caption: `✨ Level up your experience with our ${title}!\n\n${benefit}.\n\n📍 Delivery: ${location}\n⚡ Limited slots available this week!\n\n👉 ${cta} or click the link in our bio to book yours now!`,
        hashtags: ["#AfricanSmallBiz", `#${category.replace(/[^a-zA-Z]/g, "")}`, "#ShopLocal", "#LagosBusiness", "#AfriCutSell"],
        cta: `${cta} via link in bio!`,
        tips: "Pin your WhatsApp catalog link or order info in the first comment.",
      },
      {
        platform: "TikTok",
        caption: `Wait until you see how amazing this ${title} turns out 😍🔥 What do you think? Drop a comment or WhatsApp us to secure yours! #smallbiz #africantiktok`,
        hashtags: ["#TikTokMadeMeBuyIt", "#SmallBusinessCheck", "#fyp", "#AfricanCreator"],
        cta: "WhatsApp us directly to order or comment below!",
        tips: "Use a trending soundtrack and answer the first 5 customer comments within 30 minutes.",
      },
      {
        platform: "WhatsApp Status",
        caption: `✨ *NEW STOCK ALERT: ${title.toUpperCase()}*\n\n• ${benefit}\n• Fast delivery in ${location}\n\n💬 *Reply to this status to place your order or see the price catalog!*`,
        hashtags: [],
        cta: "Reply to this status to order.",
        tips: "Post the highlight video as slide 1 and price list as slide 2.",
      },
    ],
    whatsappStatus: {
      text: `✨ *${title} Now Available*\n${benefit}.\n\nReply to this status to order now! 👇`,
      suggestedEmoji: isBakery ? "🎂" : isFashion ? "👗" : isBeauty ? "🌿" : "✨",
      directOrderPrompt: `Hello! I saw your ${title} video on WhatsApp Status and would like to order.`,
    },
    hashtags: ["#AfricanBusiness", "#SmallBizAfrica", "#ShopSmall", `#${category.replace(/[^a-zA-Z]/g, "")}`, "#AfriCutSell"],
    primaryCta: `${cta}.`,
    generatedAt: new Date().toISOString(),
    aiEngine: "Dala Studio v2.4 (Heuristic Sales Reasoning Engine)",
  };
}

// Suggest Benefit & Image Details using Dala AI
app.post("/api/suggest-benefit", async (req, res) => {
  try {
    const { title, category } = req.body;
    const client = getGeminiClient();

    if (client && title) {
      const prompt = `You are Dala AI, an expert African social commerce copywriter.
Analyze the product title: "${title}" in category "${category}".
Generate JSON with:
1. "mainBenefit": A punchy, compelling 1-2 sentence customer-focused selling benefit.
2. "imageDetails": Special visual details/overlays recommended for generating sales images or video hooks.
3. "sellingPoints": An array of 3 short, persuasive bullet points highlighting why buyers love this.

Respond in strict JSON format:
{
  "mainBenefit": "...",
  "imageDetails": "...",
  "sellingPoints": ["...", "...", "..."]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are Dala AI. Respond in strict JSON.",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, ...parsed });
    }

    // Fallback heuristic suggestion
    return res.json({
      success: true,
      mainBenefit: `Premium quality ${title || "product"} designed for durability, style, and complete customer satisfaction.`,
      imageDetails: `Warm natural lighting, clean background, high-contrast overlay text highlighting "${title}".`,
      sellingPoints: [
        `Handcrafted / sourced specifically for the ${category} market`,
        `Guaranteed high quality and long-lasting value`,
        `Direct delivery available across major cities`
      ]
    });
  } catch (err) {
    console.error("Suggest benefit error:", err);
    const bodyTitle = req.body?.title || "product";
    const bodyCat = req.body?.category || "General";
    return res.json({
      success: true,
      mainBenefit: `Top quality ${bodyTitle} with fast delivery and trusted reliability.`,
      imageDetails: `High-contrast professional lighting with crisp product details.`,
      sellingPoints: [
        `Top seller in ${bodyCat}`,
        `Fast delivery and responsive customer service`,
        `Unmatched quality and value`
      ]
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AfriCut Sell server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
