import { NextResponse } from "next/server";

interface ScrapedAssetPool {
  hero: string;
  overview: string;
  amenity: string;
  interiors: string[];
}

// Clean, high-resolution architectural photography that never fails
const VERIFIED_LUXURY_POOL = {
  hero: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85",
  ],
  overview: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85",
  ],
  amenity: [
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85",
  ],
  interiors: [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=85",
  ],
};

// Anti-Clickbait Filter: Bans YouTube thumbnails, spam text, and broker ads
function filterCleanImages(images: any[] = []): string[] {
  const spamList = [
    "youtube", "ytimg", "thumb", "vlog", "video", "tour", "review", 
    "price", "crore", "lakh", "lacs", "best flat", "floor plan", 
    "layout", "logo", "icon", "badge", "avatar", "marriott", "westin", 
    "hotel", "mall", "office"
  ];

  return images
    .filter((img) => {
      const url = (img.imageUrl || "").toLowerCase();
      const title = (img.title || "").toLowerCase();
      if (!url.startsWith("http") || url.includes(".svg")) return false;
      return !spamList.some((kw) => url.includes(kw) || title.includes(kw));
    })
    .map((img) => img.imageUrl);
}

async function fetchDynamicProjectMedia(projectName: string): Promise<ScrapedAssetPool> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return {
      hero: VERIFIED_LUXURY_POOL.hero[0],
      overview: VERIFIED_LUXURY_POOL.overview[0],
      amenity: VERIFIED_LUXURY_POOL.amenity[0],
      interiors: VERIFIED_LUXURY_POOL.interiors,
    };
  }

  const negativeSearch = "-site:youtube.com -site:facebook.com -hotel -marriott -westin -mall -commercial -video -tour -thumbnail";

  try {
    const headers = { "X-API-KEY": apiKey, "Content-Type": "application/json" };
    const [exteriorRes, interiorRes, amenityRes] = await Promise.all([
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune residential building architecture elevation ${negativeSearch}`,
          gl: "in",
          num: 8,
        }),
      }),
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune luxury apartment living room modern interior ${negativeSearch}`,
          gl: "in",
          num: 10,
        }),
      }),
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune swimming pool landscaped amenities podium ${negativeSearch}`,
          gl: "in",
          num: 8,
        }),
      }),
    ]);

    const [exteriorData, interiorData, amenityData] = await Promise.all([
      exteriorRes.ok ? exteriorRes.json() : { images: [] },
      interiorRes.ok ? interiorRes.json() : { images: [] },
      amenityRes.ok ? amenityRes.json() : { images: [] },
    ]);

    const cleanExteriors = filterCleanImages(exteriorData.images);
    const cleanInteriors = filterCleanImages(interiorData.images);
    const cleanAmenities = filterCleanImages(amenityData.images);

    return {
      hero: cleanExteriors[0] || VERIFIED_LUXURY_POOL.hero[0],
      overview: cleanExteriors[1] || VERIFIED_LUXURY_POOL.overview[0],
      amenity: cleanAmenities[0] || VERIFIED_LUXURY_POOL.amenity[0],
      interiors: cleanInteriors.length >= 4 ? cleanInteriors : VERIFIED_LUXURY_POOL.interiors,
    };
  } catch (err) {
    return {
      hero: VERIFIED_LUXURY_POOL.hero[0],
      overview: VERIFIED_LUXURY_POOL.overview[0],
      amenity: VERIFIED_LUXURY_POOL.amenity[0],
      interiors: VERIFIED_LUXURY_POOL.interiors,
    };
  }
}

const DISCLAIMER_NOTICE =
  "Artistic Impression & Compliance Notice: All graphic representations, visual elevations, sample flat interiors, and amenity renders are artistic impressions. Actual configurations are governed strictly by sanctioned MahaRERA agreements.";

export async function POST(req: Request) {
  try {
    const { brochureInput, designVibe, whatsappNumber } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY in .env.local" }, { status: 500 });
    }

    // 1. Detect Cloud Vault Links
    const driveMatch = brochureInput.match(/https?:\/\/(?:drive\.google\.com|dropbox\.com)[^\s)]+/i);
    const driveUrl = driveMatch ? driveMatch[0] : "";

    // 2. Clean Project and Developer Names
    let projectName = "Raheja Vistas";
    let developer = "K Raheja Corp";

    const explicitName = brochureInput.match(/(?:Project(?:\s*Name)?|Residential Project)[\s:]*([^\n\r]+)/i);
    if (explicitName) {
      projectName = explicitName[1].replace(/[📍🏡✨🏗️]/g, "").trim();
    }

    const explicitDev = brochureInput.match(/Developer[\s:]*([^\n\r]+)/i);
    if (explicitDev) {
      developer = explicitDev[1].replace(/[📍🏡✨🏗️]/g, "").split(/[,(—\n]/)[0].trim();
    }

    // 3. Dynamic Media Fetch
    const mediaPool = await fetchDynamicProjectMedia(projectName);

    const systemPrompt = `You are a Principal Real Estate Digital Architect. Synthesize the provided dossier into a publication-grade Puck microsite JSON payload.

COMPONENT SELECTION:
You have access to a rich library of 25+ distinct UI/UX components:
- HeroSection
- StatsCounter
- OverviewBlock
- BentoGrid
- PricingTypology
- FloorPlanTabs
- TimelineSection
- PaymentPlanMilestones
- SpecificationList
- CategorizedAmenities
- GreenSustainability
- MasterPlanLayout
- RoiCalculatorCard
- NeighborhoodVibe
- ConnectivityMatrix
- ArchitectNotes
- TestimonialCards
- GalleryGrid
- VideoShowcase
- AwardsAccolades
- ComparisonTable
- ProjectVault
- FAQSection
- LeadForm
- DeveloperTrust
- ContactFooter

CRITICAL RULES:
1. Ground all configurations, carpet areas, and prices strictly in the input text. Include Simplex, Duplex, and standard layouts.
2. Keep "developer" strictly as the clean brand name (e.g. "${developer}"). Put corporate history into DeveloperTrust.description.
3. WHATSAPP ROUTING: Set "whatsappNumber": "${whatsappNumber || "919373810916"}" across all interactive blocks.
4. THEME SPECIFICATION:
   Generate an authentic 6-token theme object matching "${designVibe || "dark luxury"}":
   { "bg": "#120207", "surface": "#1e050f", "text": "#fbf5f7", "muted": "#b3929e", "accent": "#c5a059", "border": "#381020" }

REQUIRED PUCK OUTPUT STRUCTURE:
Return a JSON object:
{
  "content": [
    // Array of chosen component blocks with populated props
  ],
  "root": { "props": { "title": "${projectName} Showcase" } }
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Real Estate Engine",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Synthesize this raw project text into the rich microsite schema:\n\n${brochureInput}` },
        ],
      }),
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error(data.error?.message || "OpenRouter generation returned empty payload");

    const payload = JSON.parse(rawContent);

    // Guaranteed Image Post-Processing & Spam Protection
    if (Array.isArray(payload.content)) {
      payload.content.forEach((block: any) => {
        if (!block || !block.props) return;

        if (block.type === "HeroSection") {
          block.props.developer = developer;
          block.props.bgImageUrl = mediaPool.hero || VERIFIED_LUXURY_POOL.hero[0];
        }

        if (block.type === "OverviewBlock") {
          block.props.sideImageUrl = mediaPool.overview || VERIFIED_LUXURY_POOL.overview[0];
        }

        if (block.type === "CategorizedAmenities") {
          block.props.pavilionImageUrl = mediaPool.amenity || VERIFIED_LUXURY_POOL.amenity[0];
        }

        if (block.type === "PricingTypology" && Array.isArray(block.props.configurations)) {
          block.props.notice = DISCLAIMER_NOTICE;
          block.props.configurations.forEach((conf: any, index: number) => {
            conf.configImage =
              mediaPool.interiors[index % mediaPool.interiors.length] ||
              VERIFIED_LUXURY_POOL.interiors[index % VERIFIED_LUXURY_POOL.interiors.length];
          });
        }

        if (block.type === "ProjectVault" && driveUrl) {
          block.props.driveUrl = driveUrl;
        }

        if (block.type === "DeveloperTrust") {
          block.props.disclaimer = DISCLAIMER_NOTICE;
        }
      });
    }

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("Microsite Generation Error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate payload" }, { status: 500 });
  }
}
