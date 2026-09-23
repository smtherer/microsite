import type { Config } from "@puckeditor/core";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  MessageSquare, 
  ArrowUpRight, 
  Clock, 
  Layers, 
  HelpCircle, 
  FolderDown,
  Sparkles
} from "lucide-react";

function getWhatsAppUrl(phone: string, text: string) {
  const cleanPhone = (phone || "919876543210").replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export const viewports = [
  { width: 390, height: 844, label: "Mobile (iPhone)" },
  { width: 768, height: 1024, label: "Tablet (iPad)" },
  { width: 1440, height: 900, label: "Desktop" },
];

export const config: any = {
  viewports,
  components: {
    // 1. HERO SECTION
    HeroSection: {
      render: ({ projectName, developer, tagline, startingPrice, reraId, bgImageUrl, whatsappNumber, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        const waLink = getWhatsAppUrl(whatsappNumber, `Hi, I am interested in ${projectName || "the project"} by ${developer || "the developer"}.`);

        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="relative min-h-[85vh] md:min-h-screen flex flex-col justify-between p-6 sm:p-10 md:p-16 border-b overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 brightness-90" 
              style={{ 
                backgroundImage: `linear-gradient(to top, ${t.bg} 15%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%), url(${bgImageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"})` 
              }} 
            />

            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6" style={{ borderColor: t.border }}>
              <span className="text-xs uppercase tracking-widest font-mono px-3 py-1 border backdrop-blur-md rounded" style={{ borderColor: t.border, backgroundColor: `${t.surface}cc` }}>
                {developer}
              </span>
              <span className="text-xs font-mono tracking-widest flex items-center gap-1.5" style={{ color: t.accent }}>
                <ShieldCheck className="w-4 h-4 flex-shrink-0" /> MahaRERA: {reraId}
              </span>
            </div>

            <div className="relative z-10 max-w-4xl my-auto py-10 sm:py-16">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light uppercase tracking-tight mb-4 drop-shadow-md leading-[1.05]">
                {projectName}
              </h1>
              <p className="text-base sm:text-lg md:text-xl font-light max-w-2xl drop-shadow leading-relaxed" style={{ color: t.muted }}>
                {tagline}
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t backdrop-blur-md" style={{ borderColor: t.border }}>
              <div>
                <span className="text-[11px] uppercase font-mono tracking-widest block mb-1" style={{ color: t.muted }}>Investment Horizon</span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-mono font-medium" style={{ color: t.accent }}>{startingPrice}</span>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: t.accent, color: t.bg }}
                className="w-full sm:w-auto px-8 py-4 font-mono font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition flex items-center justify-center gap-2 rounded shadow-lg active:scale-95 text-center"
              >
                <MessageSquare className="w-4 h-4" /> Connect on WhatsApp
              </a>
            </div>
          </section>
        );
      },
    },

    // 2. OVERVIEW BLOCK
    OverviewBlock: {
      render: ({ headline, story, highlights, sideImageUrl, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="border-b p-6 sm:p-10 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest block mb-3" style={{ color: t.accent }}>01 // The Development</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light mb-6 leading-tight">{headline}</h2>
                <p className="font-light text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line" style={{ color: t.muted }}>{story}</p>
              </div>
              <div 
                className="h-[320px] sm:h-[420px] w-full border bg-cover bg-center rounded-lg shadow-2xl" 
                style={{ borderColor: t.border, backgroundImage: `url(${sideImageUrl || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"})` }} 
              />
            </div>
            {highlights && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border rounded overflow-hidden" style={{ backgroundColor: t.border, borderColor: t.border }}>
                {highlights.map((h: any, i: number) => (
                  <div key={i} style={{ backgroundColor: t.bg }} className="p-6">
                    <span className="text-[11px] uppercase font-mono tracking-wider block mb-1" style={{ color: t.muted }}>{h.label}</span>
                    <span className="text-xl sm:text-2xl font-serif font-light" style={{ color: t.accent }}>{h.value}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      },
    },

    // 3. PRICING & TYPOLOGY CARDS
    PricingTypology: {
      render: ({ heading, configurations, whatsappNumber, notice, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-1" style={{ color: t.accent }}>02 // Master Typologies</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8 pb-4 border-b" style={{ borderColor: t.border }}>{heading || "Configurations & Pricing"}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {configurations?.map((c: any, i: number) => {
                const waLink = getWhatsAppUrl(whatsappNumber, `Hi, I am inquiring about the ${c.type} (${c.carpetArea || "Unit"}) priced at ${c.price}.`);
                return (
                  <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-lg flex flex-col justify-between overflow-hidden group hover:border-neutral-500 transition">
                    <div 
                      className="h-56 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                      style={{ backgroundImage: `url(${c.configImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"})` }} 
                    />
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border rounded inline-block mb-3" style={{ color: t.muted, borderColor: t.border }}>{c.status || "Available"}</span>
                        <h3 className="text-xl sm:text-2xl font-serif font-light mb-1">{c.type}</h3>
                        <p className="text-xs sm:text-sm font-mono mb-4" style={{ color: t.muted }}>Carpet Area: {c.carpetArea}</p>
                      </div>
                      <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: t.border }}>
                        <span className="text-lg sm:text-xl font-mono font-medium" style={{ color: t.accent }}>{c.price}</span>
                        <a 
                          href={waLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ borderColor: t.accent, color: t.accent }} 
                          className="border px-3 py-1.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1 hover:bg-amber-400 hover:text-black transition rounded"
                        >
                          Inquire <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {notice && (
              <p className="mt-8 text-[11px] font-mono leading-relaxed max-w-4xl" style={{ color: t.muted }}>
                * {notice}
              </p>
            )}
          </section>
        );
      },
    },

    // 4. TIMELINE / ROADMAP SECTION (NEW)
    TimelineSection: {
      render: ({ heading, subtitle, phases, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>03 // Development Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Construction Milestones & Handover"}</h2>
            <p className="text-xs sm:text-sm font-light mb-10" style={{ color: t.muted }}>{subtitle || "Targeted execution schedule backed by developer commitment and RERA milestones."}</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {phases?.map((p: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-xl p-6 relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono px-2 py-0.5 border rounded" style={{ borderColor: t.border, color: t.accent }}>Phase 0{i + 1}</span>
                      <Clock className="w-4 h-4" style={{ color: t.accent }} />
                    </div>
                    <h3 className="text-lg font-serif font-light mb-2">{p.title}</h3>
                    <p className="text-xs font-light leading-relaxed" style={{ color: t.muted }}>{p.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: t.border }}>
                    <span className="text-xs font-mono font-medium block" style={{ color: t.accent }}>{p.date}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: t.muted }}>{p.status || "Scheduled"}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 5. ARCHITECTURAL SPECIFICATIONS (NEW)
    SpecificationList: {
      render: ({ heading, categories, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>04 // Material Pedigree</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-10">{heading || "Finishes & Engineering Specifications"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categories?.map((cat: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: t.border }}>
                    <Layers className="w-4 h-4" style={{ color: t.accent }} />
                    <h3 className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: t.accent }}>{cat.name}</h3>
                  </div>
                  <ul className="space-y-3">
                    {cat.specs?.map((spec: string, idx: number) => (
                      <li key={idx} className="text-xs sm:text-sm font-light flex items-start gap-2.5">
                        <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: t.accent }} />
                        <span style={{ color: t.muted }}>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 6. CATEGORIZED AMENITIES
    CategorizedAmenities: {
      render: ({ heading, pavilionImageUrl, categories, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>05 // Curated Lifestyle</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8">{heading || "World-Class Infrastructure"}</h2>
            <div 
              className="w-full h-[280px] sm:h-[400px] mb-8 border bg-cover bg-center rounded-lg shadow-lg" 
              style={{ backgroundImage: `url(${pavilionImageUrl || "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80"})` }} 
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {categories?.map((cat: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-lg p-6">
                  <h3 className="text-xs font-mono uppercase tracking-widest mb-4 pb-2 border-b" style={{ borderColor: t.border, color: t.accent }}>{cat.title}</h3>
                  <ul className="space-y-3">
                    {cat.items?.map((amenity: string, idx: number) => (
                      <li key={idx} className="text-xs sm:text-sm font-light flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.accent }} />
                        <span style={{ color: t.muted }}>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 7. CONNECTIVITY MATRIX
    ConnectivityMatrix: {
      render: ({ address, lat, lng, hubs, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        const safeLat = typeof lat === "number" ? lat : 18.5721;
        const safeLng = typeof lng === "number" ? lng : 73.7482;

        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>06 // Strategic Location</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{address}</h2>
            <p className="text-xs font-mono mb-8" style={{ color: t.muted }}>COORDINATES: {safeLat}° N, {safeLng}° E</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-[340px] sm:h-[440px] border rounded-lg overflow-hidden" style={{ borderColor: t.border }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  title="Location Map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${safeLng - 0.02}%2C${safeLat - 0.02}%2C${safeLng + 0.02}%2C${safeLat + 0.02}&layer=mapnik&marker=${safeLat}%2C${safeLng}`} 
                />
              </div>
              <div style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-widest mb-4 pb-2 border-b" style={{ borderColor: t.border, color: t.accent }}>Key Transit Hubs</h4>
                  <div className="space-y-3">
                    {hubs?.map((hub: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b" style={{ borderColor: `${t.border}80` }}>
                        <span style={{ color: t.text }}>{hub.name}</span>
                        <span className="font-mono font-medium" style={{ color: t.accent }}>{hub.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      },
    },

    // 8. PROJECT VAULT / GOOGLE DRIVE SECTION (NEW)
    ProjectVault: {
      render: ({ heading, description, driveUrl, buttonLabel, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-12 md:p-16 border-b text-center">
            <div className="max-w-3xl mx-auto border rounded-2xl p-8 sm:p-12 shadow-2xl" style={{ backgroundColor: t.bg, borderColor: t.border }}>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1 border rounded mb-4" style={{ borderColor: t.border, color: t.accent }}>
                <FolderDown className="w-3.5 h-3.5" /> Official Digital Vault
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-light mb-4" style={{ color: t.text }}>
                {heading || "Sanctioned Blueprints & Unit Vault"}
              </h2>
              <p className="text-xs sm:text-sm font-light max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: t.muted }}>
                {description || "Access official developer floor plans, master layout sanctions, pricing sheets, and unit inventory documents directly from the verified cloud repository."}
              </p>
              <a
                href={driveUrl || "#"}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: t.accent, color: t.bg }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-mono font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition rounded-lg shadow-xl active:scale-95 text-center"
              >
                {buttonLabel || "Open Google Drive Vault ↗"}
              </a>
            </div>
          </section>
        );
      },
    },

    // 9. FAQ ACCORDION SECTION (NEW)
    FAQSection: {
      render: ({ heading, subtitle, items, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>07 // Due Diligence</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Frequently Asked Questions"}</h2>
            <p className="text-xs sm:text-sm font-light mb-8" style={{ color: t.muted }}>{subtitle || "Essential investor clarity on payment structures, possession, and legal compliance."}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              {items?.map((faq: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: t.accent }} />
                    <h4 className="text-sm sm:text-base font-serif font-light">{faq.question}</h4>
                  </div>
                  <p className="text-xs sm:text-sm font-light leading-relaxed pl-7" style={{ color: t.muted }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 10. DEVELOPER TRUST
    DeveloperTrust: {
      render: ({ developer, legacyYears, totalDeliveredSqft, description, disclaimer, whatsappNumber, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        const waLink = getWhatsAppUrl(whatsappNumber, `Hi, I would like to speak directly with an advisor regarding ${developer || "the project"}.`);

        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b text-center">
            <div className="max-w-3xl mx-auto">
              <Building2 className="w-8 h-8 mx-auto mb-4" style={{ color: t.accent }} />
              <h3 className="text-2xl sm:text-3xl font-serif font-light uppercase tracking-wide mb-4">Developed By {developer}</h3>
              <p className="text-xs sm:text-sm font-light leading-relaxed mb-8" style={{ color: t.muted }}>{description}</p>
              
              <div className="flex justify-center gap-8 sm:gap-16 border-t pt-6 mb-8" style={{ borderColor: t.border }}>
                <div>
                  <span className="text-xl sm:text-2xl font-mono block" style={{ color: t.accent }}>{legacyYears || "25+"} Years</span>
                  <span className="text-[10px] sm:text-xs uppercase font-mono" style={{ color: t.muted }}>Legacy</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-mono block" style={{ color: t.accent }}>{totalDeliveredSqft || "20M+"} Sq.Ft.</span>
                  <span className="text-[10px] sm:text-xs uppercase font-mono" style={{ color: t.muted }}>Delivered</span>
                </div>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: t.accent, color: t.bg }}
                className="inline-flex items-center gap-2 px-8 py-4 font-mono font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition rounded shadow-lg"
              >
                <MessageSquare className="w-4 h-4" /> Connect with Advisor on WhatsApp
              </a>

              {disclaimer && (
                <p className="mt-12 text-[10px] font-mono leading-relaxed border-t pt-4" style={{ borderColor: t.border, color: t.muted }}>
                  {disclaimer}
                </p>
              )}
            </div>
          </section>
        );
      },
    },
  },
};

export default config;
