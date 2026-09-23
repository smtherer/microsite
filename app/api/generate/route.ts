import { NextResponse } from "next/server";

interface ScrapedAssetPool {
  hero: string;
  overview: string;
  amenity: string;
  interiors: string[];
}

// Editorial, magazine-grade high-res architecture images that NEVER fail or show spam text
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

// Strict Filter: Drops YouTube thumbnails, broker ads, and spam watermarks
function filterCleanImages(images: any[] = []): string[] {
  const spamKeywords = [
    "youtube", "ytimg", "thumb", "thumbnail", "vlog", "video", "tour", "review", 
    "price", "crore", "lakh", "lacs", "best flat", "floor plan", "master plan", 
    "layout", "logo", "icon", "badge", "avatar", "marriott", "westin", "hotel", 
    "mall", "office", "channel", "fbcdn", "pinimg"
  ];

  return images
    .filter((img) => {
      const url = (img.imageUrl || "").toLowerCase();
      const title = (img.title || "").toLowerCase();
      const source = (img.source || "").toLowerCase();

      if (!url.startsWith("http") || url.includes(".svg")) return false;

      // Drop any image matching spam triggers
      const isSpam = spamKeywords.some(
        (kw) => url.includes(kw) || title.includes(kw) || source.includes(kw)
      );

      return !isSpam;
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

  // Strict negative search to block YouTube thumbnails and commercial buildings
  const negativeQuery = "-site:youtube.com -site:facebook.com -site:instagram.com -hotel -marriott -westin -mall -commercial -video -tour -thumbnail";

  try {
    const headers = { "X-API-KEY": apiKey, "Content-Type": "application/json" };
    const [exteriorRes, interiorRes, amenityRes] = await Promise.all([
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune residential building facade elevation ${negativeQuery}`,
          gl: "in",
          num: 8,
        }),
      }),
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune modern luxury apartment living room ${negativeQuery}`,
          gl: "in",
          num: 10,
        }),
      }),
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune residential swimming pool landscaped podium ${negativeQuery}`,
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

    // 3. Dynamic Media Fetch with Strict Spam Filtering
    const mediaPool = await fetchDynamicProjectMedia(projectName);

    const systemPrompt = `You are a Principal Real Estate Digital Architect. Synthesize the provided dossier into a publication-grade Puck microsite JSON payload.

CRITICAL CONTENT DIRECTIVES:
1. DEVELOPER FIELD: Keep "developer" strictly as the clean brand name (e.g., "${developer}"). Do NOT put subsidiary hotel or retail names into the hero badge.
2. Ground all typologies, carpet areas, and prices strictly in the input text. Include Simplex, Duplex, and standard configurations accurately.
3. WHATSAPP ROUTING: Set "whatsappNumber": "${whatsappNumber || "919373810916"}" across all interactive blocks.
4. THEME SPECIFICATION:
   Generate an authentic 6-token theme object matching "${designVibe || "dark luxury"}":
   { "bg": "#120207", "surface": "#1e050f", "text": "#fbf5f7", "muted": "#b3929e", "accent": "#c5a059", "border": "#381020" }

REQUIRED PUCK SCHEMA:
{
  "content": [
    {
      "type": "HeroSection",
      "props": {
        "id": "HeroSection-1",
        "projectName": "${projectName}",
        "developer": "${developer}",
        "tagline": string,
        "startingPrice": string,
        "reraId": string,
        "bgImageUrl": "${mediaPool.hero}",
        "whatsappNumber": string,
        "theme": object
      }
    },
    {
      "type": "OverviewBlock",
      "props": {
        "id": "OverviewBlock-1",
        "headline": string,
        "story": string,
        "highlights": [{ "label": string, "value": string }],
        "sideImageUrl": "${mediaPool.overview}",
        "theme": object
      }
    },
    {
      "type": "PricingTypology",
      "props": {
        "id": "PricingTypology-1",
        "heading": "Curated Residences & Investment Options",
        "notice": "${DISCLAIMER_NOTICE}",
        "configurations": [
          { "type": string, "carpetArea": string, "price": string, "status": string, "configImage": "" }
        ],
        "whatsappNumber": string,
        "theme": object
      }
    },
    {
      "type": "TimelineSection",
      "props": {
        "id": "TimelineSection-1",
        "heading": "Targeted Possession & Milestones",
        "subtitle": "Phased construction schedule aligned with developer commitments.",
        "phases": [
          { "title": "Civil Foundation & Excavation", "description": "Substructure stabilization and dual-level podium casting.", "date": "Completed", "status": "Finished" },
          { "title": "Superstructure Erection", "description": "Vertical tower casting up to G+24 floors with Mivan shuttering.", "date": "In Progress", "status": "Active" },
          { "title": "Façade & MEP Works", "description": "High-speed elevator installation, electrical, and glazing integration.", "date": "Q3 2028", "status": "Scheduled" },
          { "title": "Finishing & Handover", "description": "Sanctioned occupancy certification and unit handovers.", "date": "December 2029", "status": "Committed" }
        ],
        "theme": object
      }
    },
    {
      "type": "SpecificationList",
      "props": {
        "id": "SpecificationList-1",
        "heading": "Finishes & Architectural Pedigree",
        "categories": [
          {
            "name": "Structural & Flooring",
            "specs": ["Seismic Zone III compliant RCC framed structure", "Italian marble finish vitrified flooring in living & dining", "Laminated wooden flooring in primary suites"]
          },
          {
            "name": "Kitchen & Bathrooms",
            "specs": ["Granite counter with stainless steel sink & piped gas provision", "Kohler / Grohe or equivalent CP sanitary fittings", "Full-height ceramic dado tiles & solar water connectivity"]
          },
          {
            "name": "Smart Security & Electrical",
            "specs": ["Biometric digital door lock with RFID & key bypass", "3-tier 24/7 CCTV surveillance across podium & lobby", "100% DG power backup for essential lifts and common utilities"]
          }
        ],
        "theme": object
      }
    },
    {
      "type": "CategorizedAmenities",
      "props": {
        "id": "CategorizedAmenities-1",
        "heading": "2.6 Acres of Sovereign Lifestyle",
        "pavilionImageUrl": "${mediaPool.amenity}",
        "categories": [
          { "title": string, "items": [string] }
        ],
        "theme": object
      }
    },
    {
      "type": "ConnectivityMatrix",
      "props": {
        "id": "ConnectivityMatrix-1",
        "address": string,
        "lat": 18.5721,
        "lng": 73.7482,
        "hubs": [{ "name": string, "distance": string }],
        "theme": object
      }
    },
    ${
      driveUrl
        ? `{
      "type": "ProjectVault",
      "props": {
        "id": "ProjectVault-1",
        "heading": "Sanctioned Blueprints & Official Vault",
        "description": "Access complete architectural floor plans, unit dimensions, master layout sanction certificates, and official developer brochures directly from the verified cloud repository.",
        "driveUrl": "${driveUrl}",
        "buttonLabel": "Access Project Google Drive Vault ↗",
        "theme": object
      }
    },`
        : ""
    }
    {
      "type": "FAQSection",
      "props": {
        "id": "FAQSection-1",
        "heading": "Investor Due Diligence & FAQs",
        "subtitle": "Key regulatory, financial, and possession disclosures for prospective buyers.",
        "items": [
          { "question": "What is the committed possession date?", "answer": "The official developer possession commitment for Raheja Vistas is December 2029 as per sanctioned filings." },
          { "question": "Are 20:80 developer payment schedules available?", "answer": "Yes, select 3 BHK configurations offer special 20:80 milestone-linked developer schemes subject to bank approvals." },
          { "question": "What are the simplex and duplex options?", "answer": "Simplex 2+2 Jodi combinations range from 1,360 to 1,824 sq.ft., alongside an exclusive 3 BHK Duplex configuration of 1,472 sq.ft." },
          { "question": "Which major transit corridors are nearby?", "answer": "The project is positioned near Mahalunge Circle, approximately 8 minutes from Balewadi High Street and 12 minutes from Hinjawadi IT Park Phase 1." }
        ],
        "theme": object
      }
    },
    {
      "type": "DeveloperTrust",
      "props": {
        "id": "DeveloperTrust-1",
        "developer": "${developer}",
        "legacyYears": string,
        "totalDeliveredSqft": string,
        "description": string,
        "disclaimer": "${DISCLAIMER_NOTICE}",
        "whatsappNumber": string,
        "theme": object
      }
    }
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
          { role: "user", content: `Synthesize this raw project text into the microsite schema:\n\n${brochureInput}` },
        ],
      }),
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error(data.error?.message || "OpenRouter generation returned empty payload");

    const payload = JSON.parse(rawContent);

    // Guaranteed Image Assignment & Spam Overwrite
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
            // Assign clean, high-res interior photography without broker text
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
}      const url = (img.imageUrl || "").toLowerCase();
      const title = (img.title || "").toLowerCase();
      return (
        url.startsWith("http") &&
        !url.includes(".svg") &&
        !url.includes("logo") &&
        !url.includes("icon") &&
        !url.includes("avatar") &&
        !url.includes("floor-plan") &&
        !title.includes("floor plan") &&
        !title.includes("master plan") &&
        !title.includes("marriott") &&
        !title.includes("westin") &&
        !title.includes("hotel")
      );
    })
    .map((img) => img.imageUrl);
}

// Targeted residential search with negative hotel & commercial keywords
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

  // Block commercial entities, hotels, and retail malls from the image algorithm
  const exclusions = "-hotel -marriott -westin -novotel -courtyard -inorbit -shoppers -mall -hospital -office -mindspace -commerzone";

  try {
    const headers = { "X-API-KEY": apiKey, "Content-Type": "application/json" };
    const [exteriorRes, interiorRes, amenityRes] = await Promise.all([
      // 1. Exterior elevation strictly for the residential project
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune residential towers elevation render ${exclusions}`,
          gl: "in",
          num: 6,
        }),
      }),
      // 2. Real apartment interiors (living rooms, bedrooms)
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune sample flat interior living room ${exclusions}`,
          gl: "in",
          num: 8,
        }),
      }),
      // 3. Residential amenities
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune residential clubhouse swimming pool podium ${exclusions}`,
          gl: "in",
          num: 6,
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
      interiors: cleanInteriors.length >= 3 ? cleanInteriors : VERIFIED_LUXURY_POOL.interiors,
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

    // 1. Detect Google Drive / Vault Links
    const driveMatch = brochureInput.match(/https?:\/\/(?:drive\.google\.com|dropbox\.com)[^\s)]+/i);
    const driveUrl = driveMatch ? driveMatch[0] : "";

    // 2. Clean Project and Developer Extraction
    let projectName = "Raheja Vistas";
    let developer = "K Raheja Corp";

    const explicitName = brochureInput.match(/(?:Project(?:\s*Name)?|Residential Project)[\s:]*([^\n\r]+)/i);
    if (explicitName) {
      projectName = explicitName[1].replace(/[📍🏡✨🏗️]/g, "").trim();
    } else {
      const firstLine = brochureInput.split("\n").map((l: string) => l.trim()).find((l: string) => l && !l.includes("http") && !l.includes("2026"));
      if (firstLine) {
        projectName = firstLine.replace(/[📍🏡✨🏗️]/g, "").trim();
      }
    }

    const explicitDev = brochureInput.match(/Developer[\s:]*([^\n\r]+)/i);
    if (explicitDev) {
      // Strips out emojis and limits developer to brand name only
      developer = explicitDev[1].replace(/[📍🏡✨🏗️]/g, "").split(/[,(—\n]/)[0].trim();
    }

    // 3. Fetch images with hotel exclusions
    const mediaPool = await fetchDynamicProjectMedia(projectName);

    const systemPrompt = `You are a Principal Real Estate Digital Architect. Synthesize the provided dossier into a publication-grade Puck microsite JSON payload.

CRITICAL CONTENT DIRECTIVES:
1. DEVELOPER FIELD: Keep "developer" concise (e.g. "K Raheja Corp"). Place corporate history, retail malls, and hospitality brands strictly into "DeveloperTrust.description". Never put hotel names in the developer badge.
2. Ground all typologies, carpet areas, and prices strictly in the input text. Include Simplex, Duplex, and standard configurations accurately.
3. WHATSAPP ROUTING: Set "whatsappNumber": "${whatsappNumber || "919373810916"}" across all interactive blocks.
4. THEME SPECIFICATION:
   Generate a 6-token theme object matching "${designVibe || "dark luxury"}":
   { "bg": "#120207", "surface": "#1e050f", "text": "#fbf5f7", "muted": "#b3929e", "accent": "#c5a059", "border": "#381020" }

REQUIRED PUCK SCHEMA:
{
  "content": [
    {
      "type": "HeroSection",
      "props": {
        "id": "HeroSection-1",
        "projectName": "${projectName}",
        "developer": "${developer}",
        "tagline": string,
        "startingPrice": string,
        "reraId": string,
        "bgImageUrl": "${mediaPool.hero}",
        "whatsappNumber": string,
        "theme": object
      }
    },
    {
      "type": "OverviewBlock",
      "props": {
        "id": "OverviewBlock-1",
        "headline": string,
        "story": string,
        "highlights": [{ "label": string, "value": string }],
        "sideImageUrl": "${mediaPool.overview}",
        "theme": object
      }
    },
    {
      "type": "PricingTypology",
      "props": {
        "id": "PricingTypology-1",
        "heading": "Curated Residences & Investment Options",
        "notice": "${DISCLAIMER_NOTICE}",
        "configurations": [
          { "type": string, "carpetArea": string, "price": string, "status": string, "configImage": "" }
        ],
        "whatsappNumber": string,
        "theme": object
      }
    },
    {
      "type": "CategorizedAmenities",
      "props": {
        "id": "CategorizedAmenities-1",
        "heading": "Curated Lifestyle Amenities",
        "pavilionImageUrl": "${mediaPool.amenity}",
        "categories": [
          { "title": string, "items": [string] }
        ],
        "theme": object
      }
    },
    {
      "type": "ConnectivityMatrix",
      "props": {
        "id": "ConnectivityMatrix-1",
        "address": string,
        "lat": 18.5721,
        "lng": 73.7482,
        "hubs": [{ "name": string, "distance": string }],
        "theme": object
      }
    },
    ${
      driveUrl
        ? `{
      "type": "ProjectVault",
      "props": {
        "id": "ProjectVault-1",
        "heading": "Verified Blueprints & Project Dossier",
        "description": "Access sanctioned architectural plans, layouts, and official developer brochures directly from the verified cloud repository.",
        "driveUrl": "${driveUrl}",
        "buttonLabel": "Access Project Google Drive Vault ↗",
        "theme": object
      }
    },`
        : ""
    }
    {
      "type": "DeveloperTrust",
      "props": {
        "id": "DeveloperTrust-1",
        "developer": "${developer}",
        "legacyYears": string,
        "totalDeliveredSqft": string,
        "description": string,
        "disclaimer": "${DISCLAIMER_NOTICE}",
        "whatsappNumber": string,
        "theme": object
      }
    }
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
          { role: "user", content: `Synthesize this raw project text into the microsite schema:\n\n${brochureInput}` },
        ],
      }),
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error(data.error?.message || "OpenRouter generation returned empty payload");

    const payload = JSON.parse(rawContent);

    // Guaranteed Image Assignment
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
