export interface ScoredImage {
    url: string;
    title: string;
    category: "elevation" | "amenity" | "masterplan" | "general";
    score: number;
  }
  
  export async function fetchCuratedProjectImages(projectName: string): Promise<{
    heroImage: string;
    conceptImage: string;
    amenityImages: string[];
    allValid: string[];
  }> {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      return { heroImage: "", conceptImage: "", amenityImages: [], allValid: [] };
    }
  
    try {
      const query = `${projectName} Pune residential elevation render pool exterior`;
      const res = await fetch("https://google.serper.dev/images", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, gl: "in", hl: "en", num: 20 }),
      });
  
      if (!res.ok) return { heroImage: "", conceptImage: "", amenityImages: [], allValid: [] };
  
      const data = await res.json();
      const rawImages: any[] = data.images || [];
  
      const scored: ScoredImage[] = [];
  
      for (const img of rawImages) {
        const url = (img.imageUrl || "").toLowerCase();
        const title = (img.title || "").toLowerCase();
  
        // 1. HARD EXCLUSIONS: Skip badges, logos, SVGs, and known broker ad banners
        if (
          url.includes(".svg") ||
          url.includes("logo") ||
          url.includes("avatar") ||
          title.includes("review") ||
          title.includes("resale") ||
          title.includes("circle 2 min") || // Broker banner graphics
          url.includes("map")
        ) {
          continue;
        }
  
        let category: ScoredImage["category"] = "general";
        let score = 10;
  
        // 2. Classify Masterplans / 2D layouts
        if (title.includes("master plan") || url.includes("master-plan") || title.includes("layout")) {
          category = "masterplan";
          score += 5;
        }
        // 3. Classify Amenities / Pools / Clubhouses
        else if (
          title.includes("pool") ||
          title.includes("clubhouse") ||
          title.includes("gym") ||
          url.includes("banner") || // Banners on developer sites are almost always landscape pool/exterior shots
          title.includes("landscape")
        ) {
          category = "amenity";
          score += 25; // High priority for visual appeal
        }
        // 4. Classify Elevations & Exterior Towers
        else if (
          title.includes("elevation") ||
          title.includes("exterior") ||
          title.includes("tower") ||
          title.includes("facade") ||
          url.includes("elevation")
        ) {
          category = "elevation";
          score += 30; // Best for Hero & Architecture
        }
  
        // Bonus for clean developer CDN URLs (e.g. imagekit, developer official sites)
        if (url.includes("mahindralifespaces") || url.includes("lodhagroup") || url.includes("imagekit.io")) {
          score += 15;
        }
  
        scored.push({
          url: img.imageUrl,
          title: img.title || "Project Render",
          category,
          score,
        });
      }
  
      // Sort by quality score descending
      scored.sort((a, b) => b.score - a.score);
  
      // Filter out 2D masterplans from the primary hero/elevation slots
      const elevations = scored.filter((s) => s.category === "elevation" || s.category === "general");
      const amenities = scored.filter((s) => s.category === "amenity");
  
      // Assign slots intelligently
      const heroImage = elevations[0]?.url || amenities[0]?.url || scored[0]?.url || "";
      const conceptImage = elevations[1]?.url || amenities[1]?.url || scored[1]?.url || "";
      const amenityImages = amenities.map((a) => a.url).slice(0, 4);
  
      return {
        heroImage,
        conceptImage,
        amenityImages,
        allValid: scored.map((s) => s.url),
      };
    } catch (err) {
      console.error("Image curation failure:", err);
      return { heroImage: "", conceptImage: "", amenityImages: [], allValid: [] };
    }
  }