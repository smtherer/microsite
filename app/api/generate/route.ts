import { NextResponse } from "next/server";

interface ScrapedAssetPool {
  hero: string;
  overview: string;
  amenity: string;
  interiors: string[];
}

// Clean filtering: Rejects floor plans, broker spam banners, logos, and badges
function filterCleanImages(images: any[] = []): string[] {
  return images
    .filter((img) => {
      const url = (img.imageUrl || "").toLowerCase();
      const title = (img.title || "").toLowerCase();
      return (
        url.startsWith("http") &&
        !url.includes(".svg") &&
        !url.includes("logo") &&
        !url.includes("icon") &&
        !url.includes("avatar") &&
        !title.includes("master plan") &&
        !title.includes("floor plan") &&
        !title.includes("layout") &&
        !title.includes("site plan") &&
        !title.includes("circle 2 min") &&
        !title.includes("review") &&
        !title.includes("price")
      );
    })
    .map((img) => img.imageUrl);
}

// Dynamically queries Serper with intent-specific keywords
async function fetchDynamicProjectMedia(projectName: string, developer: string): Promise<ScrapedAssetPool> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return { hero: "", overview: "", amenity: "", interiors: [] };
  }

  const headers = {
    "X-API-KEY": apiKey,
    "Content-Type": "application/json",
  };

  try {
    // 3 parallel, purpose-specific queries
    const [exteriorRes, interiorRes, amenityRes] = await Promise.all([
      // 1. Exterior towers & elevation renders
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune architectural elevation exterior render`,
          gl: "in",
          hl: "en",
          num: 10,
        }),
      }),
      // 2. Real sample flat interiors (living rooms, bedrooms)
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" OR "${developer}" Pune sample flat show apartment interior living room bedroom`,
          gl: "in",
          hl: "en",
          num: 10,
        }),
      }),
      // 3. Clubhouse and pool facilities
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `"${projectName}" Pune clubhouse swimming pool amenities render`,
          gl: "in",
          hl: "en",
          num: 10,
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

    // Fallback search strictly for interiors if the project is a completely unbuilt parcel with 0 photos
    let finalInteriors = cleanInteriors;
    if (finalInteriors.length === 0) {
      const liveInteriorFallback = await fetch("https://google.serper.dev/images", {
        method: "POST",
        headers,
        body: JSON.stringify({
          q: `${developer} luxury residential sample flat interior living room modern`,
          gl: "in",
          hl: "en",
          num: 6,
        }),
      });
      if (liveInteriorFallback.ok) {
        const fallbackData = await liveInteriorFallback.json();
        finalInteriors = filterCleanImages(fallbackData.images);
      }
    }

    return {
      hero: cleanExteriors[0] || cleanAmenities[0] || "",
      overview: cleanExteriors[1] || cleanExteriors[0] || "",
      amenity: cleanAmenities[0] || cleanExteriors[2] || "",
      interiors: finalInteriors,
    };
  } catch (err) {
    console.error("Dynamic media extraction failed:", err);
    return { hero: "", overview: "", amenity: "", interiors: [] };
  }
}

const DISCLAIMER_NOTICE = 
  "Artistic Impression & Compliance Notice: All graphic representations, visual elevations, sample flat interiors, and amenity renders are artistic impressions and representational concepts. Actual layouts, materials, and spatial configurations are governed strictly by sanctioned MahaRERA agreements.";

export async function POST(req: Request) {
  try {
    const { brochureInput, designVibe, whatsappNumber } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY in .env.local" }, { status: 500 });
    }

    // Parse project entity details straight from the input text
    const nameMatch = brochureInput.match(/Project:\s*([^\n\r]+)/i);
    const devMatch = brochureInput.match(/Developer:\s*([^\n\r]+)/i);
    const projectName = nameMatch ? nameMatch[1].trim() : "Luxury Project";
    const developer = devMatch ? devMatch[1].trim() : "Premium Developer";

    // Dynamically query real web assets for this specific development
    const mediaPool = await fetchDynamicProjectMedia(projectName, developer);

    const systemPrompt = `You are a Principal Real Estate Digital Architect. Synthesize the provided dossier into a publication-grade Puck microsite JSON payload.

CRITICAL CONTENT DIRECTIVES:
1. Ground all typologies, carpet areas, and prices strictly in the input text. Never fabricate unlisted configurations.
2. Filter out internal compliance footnotes or "Critical Data Gaps" sections from the customer-facing copy.
3. THEME SPECIFICATION:
   Generate an authentic 6-token theme object matching "${designVibe || "dark luxury"}":
   { "bg": "#09090b", "surface": "#121215", "text": "#fafafa", "muted": "#a1a1aa", "accent": "#facc15", "border": "#27272a" }
4. WHATSAPP ROUTING:
   Set "whatsappNumber": "${whatsappNumber || "919876543210"}" across all interactive blocks.

REQUIRED PUCK SCHEMA:
{
  "content": [
    {
      "type": "HeroSection",
      "props": {
        "id": "HeroSection-1",
        "projectName": string,
        "developer": string,
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
        "lat": number,
        "lng": number,
        "hubs": [{ "name": string, "distance": string }],
        "theme": object
      }
    },
    {
      "type": "DeveloperTrust",
      "props": {
        "id": "DeveloperTrust-1",
        "developer": string,
        "legacyYears": string,
        "totalDeliveredSqft": string,
        "description": string,
        "disclaimer": "${DISCLAIMER_NOTICE}",
        "whatsappNumber": string,
        "theme": object
      }
    }
  ],
  "root": { "props": { "title": "Project Showcase" } }
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
          { role: "user", content: `Architect this project data into a real estate microsite payload:\n\n${brochureInput}` },
        ],
      }),
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("OpenRouter generation returned empty payload");

    const payload = JSON.parse(rawContent);

    // Dynamic Post-Processing: Guarantee every slot has a clean, live-scraped image
    if (Array.isArray(payload.content)) {
      payload.content.forEach((block: any) => {
        if (!block || !block.props) return;

        if (block.type === "HeroSection") {
          block.props.bgImageUrl = mediaPool.hero;
        }

        if (block.type === "OverviewBlock") {
          block.props.sideImageUrl = mediaPool.overview;
        }

        if (block.type === "CategorizedAmenities") {
          block.props.pavilionImageUrl = mediaPool.amenity;
        }

        // Dynamically distribute the scraped sample flat interiors across unit cards
        if (block.type === "PricingTypology" && Array.isArray(block.props.configurations)) {
          block.props.notice = DISCLAIMER_NOTICE;
          block.props.configurations.forEach((conf: any, index: number) => {
            if (mediaPool.interiors.length > 0) {
              conf.configImage = mediaPool.interiors[index % mediaPool.interiors.length];
            }
          });
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