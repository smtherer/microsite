import { NextResponse } from "next/server";

function extractImagesFromHtml(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  try {
    const ogMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1]) images.push(ogMatch[1]);

    const imgRegex = /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
    let match;
    const urlObj = new URL(baseUrl);

    while ((match = imgRegex.exec(html)) !== null) {
      let src = match[1];
      if (!src) continue;
      if (src.startsWith("//")) src = "https:" + src;
      else if (src.startsWith("/")) src = `${urlObj.origin}${src}`;

      const lower = src.toLowerCase();
      if (
        !lower.includes("logo") &&
        !lower.includes("icon") &&
        !lower.includes("arrow") &&
        !lower.includes("badge") &&
        !images.includes(src)
      ) {
        images.push(src);
      }
    }
  } catch (e) {
    console.error("Image scraping extraction error:", e);
  }
  return images.slice(0, 10);
}

function cleanCitations(text: string): string {
  return text.replace(/\[\d+\]/g, "").replace(/\s{2,}/g, " ").trim();
}

const MASTER_PERPLEXITY_SYSTEM_PROMPT = `You are a Principal Architectural Research Analyst, Urban Planner, and RERA Verification Auditor specializing in Western India and Pune luxury real estate developments.

YOUR OBJECTIVE:
Execute an exhaustive investigation to extract verified quantitative metrics, architectural pedigree, and spatial dimensions. 

MANDATORY QUANTITATIVE & ARCHITECTURAL METRICS:
1. DESIGN PEDIGREE & COLLABORATIONS:
   - Identify the Master Architect, Principal Planner, Landscape Architect, or Celebrity Collaborator (e.g., Christopher Charles Benninger / CCBA, Greg Norman Golf Design, Hafeez Contractor, RSP, Belt Collins, Studio HBA).
2. SPATIAL & SCALE METRICS (DO NOT OMIT):
   - Total Township / Land Parcel: Exact acreage or hectares.
   - Open-to-Sky Ratio: Exact open space percentage (e.g., 85% open greens).
   - Clubhouse Footprint: Explicit square footage of the central clubhouse (e.g., 50,000 sq.ft. Club Belmondo, 25,000 sq.ft. Clubhouse).
   - Linear & Aquatic Scales: Length of promenades (e.g., 1 km Pavana riverfront), golf course acreage/holes (e.g., 45-acre 9-hole course), or pool specifications (25m / 50m Olympic).
   - Vertical Profile: Exact tower heights (G+X floors), floorplate configuration, and total units.
3. PRECISE CARPET AREAS & PRICING:
   - List verified RERA carpet area ranges in SQ.FT. with realistic starting ticket prices.
4. PUNE RERA CODE VALIDATION:
   - Pune projects MUST carry a "P521..." MahaRERA prefix. Never output P519 (Mumbai City), P518 (Mumbai Suburban), or P517 (Thane).
   - Pre-RERA projects (OC received prior to May 2017) must be marked as "Delivered / Ready-to-Move (Pre-RERA / OC Received)".
5. FORMAT RIGOR:
   - Do NOT output disclaimer statements like "not verified from sources" or "cannot be verified here".
   - Do NOT output bracket citations like [1], [2], or [15].

OUTPUT FORMAT:
Project: [Official Project Name]
Developer: [Developer Entity / Parent Group]
Master Architect & Landscape Design: [Principal Architect, Landscape Designer, Signature Partners]
Location: [Micro-Market, Specific Arterial Corridor, Landmark Vicinity, PIN Code]
Coordinates: [Latitude, Longitude]
Site Scale: [Total Acres | Open Space % | Number of Towers & G+X Floors | Total Units]
Status & MahaRERA: [MahaRERA Registration Number(s) with P521 prefix OR Pre-RERA Status]

Masterplan & Architectural Concept:
[Two dense, editorial paragraphs detailing the architectural orientation, facade language, natural water/wind corridors, cross-ventilation, and green building certifications.]

Residential Typologies & Realistic Pricing:
- [Typology]: [Exact Carpet Area in Sq.Ft.] | Starting from [Price Band] | [Key architectural/spatial highlight]

Clubhouse & Curated Amenities:
1. Signature Sports & Clubhouse Footprint:
   - [Clubhouse footprint in Sq.Ft. and multi-level zones]
   - [Championship sporting grounds, golf infrastructure, turf fields, tennis/squash courts]
   - [Aquatic facilities: lap pools, heated indoor pools, aqua gyms, cabanas]
2. Riverfront, Wellness & Landscapes:
   - [Promenade lengths in km/meters, nature trails, riverside decks, open-air lawns]
   - [Spa square footage, therapy suites, steam/sauna, meditation decks]
3. Community, Culture & Executive:
   - [Private screening theatres, banquet halls, cafes, coworking spaces]
4. Security & Sustainability:
   - [Access control tiers, power backup, rainwater harvesting, sewage treatment plants]

Strategic Vicinity Transit Matrix:
- [Immediate Landmark]: [Distance in km] ([Travel time in mins])
- [Primary Commercial / IT Hub]: [Distance in km] ([Travel time in mins])
- [Nearest Expressway / Highway]: [Distance in km] ([Travel time in mins])
- [Pune Central Railway Station]: [Distance in km] ([Travel time in mins])
- [Pune International Airport]: [Distance in km] ([Travel time in mins])

Developer Profile:
[Delivered portfolio footprint in million sq.ft., years active, and market standing.]`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const rawInput = (formData.get("input") as string) || (formData.get("url") as string) || "";
    const file = formData.get("file") as File | null;

    let realImages: string[] = [];
    let userQuery = "";

    // 1. PDF File Upload
    if (file && file.size > 0) {
      const { extractText } = await import("unpdf");
      const arrayBuffer = await file.arrayBuffer();
      const { text } = await extractText(new Uint8Array(arrayBuffer));
      const rawText = Array.isArray(text) ? text.join("\n") : text;
      userQuery = `Extract all architectural specifications, clubhouse square footage, typologies, and carpet areas from this brochure:\n\n${rawText.slice(0, 30000)}`;
    }
    // 2. Direct Website URL Scraping
    else if (rawInput.trim().startsWith("http://") || rawInput.trim().startsWith("https://")) {
      const targetUrl = rawInput.trim().split(" ")[0];
      const res = await fetch(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      const html = await res.text();
      realImages = extractImagesFromHtml(html, targetUrl);
      const cleanText = html.replace(/<[^>]+>/g, " ").slice(0, 25000);
      userQuery = `Extract detailed spatial footprint, clubhouse sq.ft., architect credits, and floor plans from this webpage (${targetUrl}):\n\n${cleanText}`;
    }
    // 3. Project Name Query -> Perplexity Search with Explicit Metric Triggers
    else if (rawInput.trim()) {
      const cleanTarget = rawInput.trim();
      // Targeted query targeting structural scale, clubhouse sq ft, and architects
      userQuery = `Conduct an exhaustive architectural investigation for: "${cleanTarget} Pune Maharashtra" architect designer "clubhouse sq ft" "acres" "carpet area" -Mumbai -Wadala -Bangalore.
Identify the master architect, landscape designer, exact clubhouse square footage, total acreage, open space %, promenade length, tower heights, and realistic carpet area ranges.`;
    }

    if (!userQuery) {
      return NextResponse.json({ error: "Please provide a project name, URL, or PDF." }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Real Estate Engine",
      },
      body: JSON.stringify({
        model: "perplexity/sonar-pro",
        temperature: 0.1,
        messages: [
          { role: "system", content: MASTER_PERPLEXITY_SYSTEM_PROMPT },
          { role: "user", content: userQuery },
        ],
      }),
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    if (!rawContent) {
      throw new Error(data.error?.message || "Perplexity Sonar-Pro returned an empty payload.");
    }

    const cleanedBrief = cleanCitations(rawContent);

    return NextResponse.json({
      extractedData: cleanedBrief,
      scrapedImages: realImages,
    });
  } catch (err: any) {
    console.error("Extraction error:", err);
    return NextResponse.json({ error: err.message || "Extraction failed" }, { status: 500 });
  }
}