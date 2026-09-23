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
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  Leaf,
  Video,
  Phone,
  FileText,
  Calculator,
  Star,
  Quote,
  Compass,
  Check,
  ExternalLink,
  ChevronRight,
  Download,
} from "lucide-react";

function getWhatsAppUrl(phone: string, text: string) {
  const cleanPhone = (phone || "919373810916").replace(/[^0-9]/g, "");
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
        const waLink = getWhatsAppUrl(whatsappNumber, `Hi, I am inquiring about ${projectName || "the project"} by ${developer || "the developer"}.`);

        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="relative min-h-[85vh] md:min-h-screen flex flex-col justify-between p-6 sm:p-10 md:p-16 border-b overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 brightness-90 scale-105" 
              style={{ 
                backgroundImage: `linear-gradient(to top, ${t.bg} 15%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%), url(${bgImageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=85"})` 
              }} 
            />
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6" style={{ borderColor: t.border }}>
              <span className="text-xs uppercase tracking-widest font-mono px-3 py-1.5 border backdrop-blur-md rounded-md" style={{ borderColor: t.border, backgroundColor: `${t.surface}cc` }}>
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
                className="w-full sm:w-auto px-8 py-4 font-mono font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition flex items-center justify-center gap-2 rounded-lg shadow-lg active:scale-95 text-center"
              >
                <MessageSquare className="w-4 h-4" /> Connect with Advisor on WhatsApp
              </a>
            </div>
          </section>
        );
      },
    },

    // 2. STATS & KPI COUNTER ROW
    StatsCounter: {
      render: ({ stats, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, borderColor: t.border }} className="border-b py-8 px-6 sm:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {stats?.map((s: any, i: number) => (
                <div key={i} className="text-center sm:text-left border-l-2 pl-4" style={{ borderColor: t.accent }}>
                  <span className="text-2xl sm:text-4xl font-serif font-light block" style={{ color: t.accent }}>{s.value}</span>
                  <span className="text-xs font-mono uppercase tracking-wider block mt-1" style={{ color: t.text }}>{s.label}</span>
                  {s.sub && <span className="text-[10px] font-mono block mt-0.5" style={{ color: t.muted }}>{s.sub}</span>}
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 3. EDITORIAL OVERVIEW BLOCK
    OverviewBlock: {
      render: ({ headline, story, highlights, sideImageUrl, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="border-b p-6 sm:p-10 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest block mb-3" style={{ color: t.accent }}>01 // The Master Estate</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light mb-6 leading-tight">{headline}</h2>
                <p className="font-light text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line" style={{ color: t.muted }}>{story}</p>
              </div>
              <div 
                className="h-[320px] sm:h-[420px] w-full border bg-cover bg-center rounded-xl shadow-2xl" 
                style={{ borderColor: t.border, backgroundImage: `url(${sideImageUrl || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"})` }} 
              />
            </div>
            {highlights && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border rounded-xl overflow-hidden" style={{ backgroundColor: t.border, borderColor: t.border }}>
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

    // 4. BENTO GRID ARCHITECTURAL SHOWCASE
    BentoGrid: {
      render: ({ heading, tagline, items, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-1" style={{ color: t.accent }}>02 // Architectural Pillars</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Curated Design Blueprint"}</h2>
            <p className="text-xs sm:text-sm font-light mb-8 max-w-xl" style={{ color: t.muted }}>{tagline || "Engineered with sovereign low-density spatial planning."}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items?.map((item: any, i: number) => (
                <div 
                  key={i} 
                  style={{ backgroundColor: t.surface, borderColor: t.border }} 
                  className={`border rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative ${i === 0 ? "md:col-span-2" : ""}`}
                >
                  {item.imageUrl && (
                    <div 
                      className="h-44 w-full rounded-lg mb-4 bg-cover bg-center border" 
                      style={{ borderColor: t.border, backgroundImage: `url(${item.imageUrl})` }}
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border rounded inline-block mb-3" style={{ color: t.accent, borderColor: t.border }}>
                      {item.badge || `Pillar 0${i + 1}`}
                    </span>
                    <h3 className="text-xl font-serif font-light mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: t.muted }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 5. MASTER PRICING & CONFIGURATIONS
    PricingTypology: {
      render: ({ heading, configurations, whatsappNumber, notice, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-1" style={{ color: t.accent }}>03 // Master Typologies</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8 pb-4 border-b" style={{ borderColor: t.border }}>{heading || "Configurations & Pricing"}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {configurations?.map((c: any, i: number) => {
                const waLink = getWhatsAppUrl(whatsappNumber, `Hi, I am inquiring about the ${c.type} (${c.carpetArea || "Unit"}) priced at ${c.price}.`);
                return (
                  <div key={i} style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-xl flex flex-col justify-between overflow-hidden group hover:border-neutral-500 transition shadow-lg">
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
                          className="border px-3 py-1.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1 hover:bg-amber-400 hover:text-black transition rounded-md"
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

    // 6. FLOOR PLAN TABBED SHOWCASE
    FloorPlanTabs: {
      render: ({ heading, plans, whatsappNumber, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>04 // Architectural Schematics</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8">{heading || "Unit Layouts & Floor Plans"}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans?.map((plan: any, i: number) => {
                const waLink = getWhatsAppUrl(whatsappNumber, `Requesting PDF layout schematic for ${plan.title}.`);
                return (
                  <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3 pb-2 border-b" style={{ borderColor: t.border }}>
                        <span className="text-xs font-mono uppercase" style={{ color: t.accent }}>{plan.tag || "Standard Layout"}</span>
                        <span className="text-xs font-mono" style={{ color: t.muted }}>{plan.area}</span>
                      </div>
                      <h3 className="text-xl font-serif font-light mb-2">{plan.title}</h3>
                      <p className="text-xs font-light mb-4" style={{ color: t.muted }}>{plan.description}</p>
                      <div 
                        className="h-48 w-full border rounded-lg bg-cover bg-center mb-6" 
                        style={{ borderColor: t.border, backgroundImage: `url(${plan.planImageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"})` }} 
                      />
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundColor: t.accent, color: t.bg }}
                      className="w-full py-3 text-center text-xs font-mono uppercase font-semibold tracking-wider rounded-lg hover:opacity-90 transition flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Request Blueprints PDF
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        );
      },
    },

    // 7. TIMELINE & MILESTONES
    TimelineSection: {
      render: ({ heading, subtitle, phases, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>05 // Construction Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Execution Roadmap & Delivery"}</h2>
            <p className="text-xs sm:text-sm font-light mb-10" style={{ color: t.muted }}>{subtitle || "Phased construction schedule aligned with developer commitments."}</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {phases?.map((p: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-xl p-6 flex flex-col justify-between">
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

    // 8. PAYMENT PLAN & FINANCIAL MILESTONES
    PaymentPlanMilestones: {
      render: ({ heading, subtitle, breakdown, note, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>06 // Financial Structure</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Payment Schemes & Schedule"}</h2>
            <p className="text-xs sm:text-sm font-light mb-8" style={{ color: t.muted }}>{subtitle || "Transparent, milestone-linked financial schedules."}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {breakdown?.map((b: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-xl p-5">
                  <span className="text-3xl font-serif font-light block mb-2" style={{ color: t.accent }}>{b.percentage}</span>
                  <h4 className="text-sm font-medium mb-1">{b.stage}</h4>
                  <p className="text-xs font-light" style={{ color: t.muted }}>{b.trigger}</p>
                </div>
              ))}
            </div>
            {note && <p className="text-[11px] font-mono mt-6" style={{ color: t.muted }}>* {note}</p>}
          </section>
        );
      },
    },

    // 9. MATERIAL & SPECIFICATION MATRIX
    SpecificationList: {
      render: ({ heading, categories, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>07 // Material Pedigree</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-10">{heading || "Finishes & Engineering Specifications"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {categories?.map((cat: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-xl p-6">
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

    // 10. CATEGORIZED AMENITIES
    CategorizedAmenities: {
      render: ({ heading, pavilionImageUrl, categories, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>08 // Curated Lifestyle</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8">{heading || "World-Class Infrastructure"}</h2>
            <div 
              className="w-full h-[280px] sm:h-[400px] mb-8 border bg-cover bg-center rounded-2xl shadow-lg" 
              style={{ backgroundImage: `url(${pavilionImageUrl || "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85"})` }} 
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {categories?.map((cat: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-xl p-6">
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

    // 11. SUSTAINABILITY & GREEN FEATURES
    GreenSustainability: {
      render: ({ heading, rating, features, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest block mb-1" style={{ color: t.accent }}>09 // Environmental Stewardship</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-light">{heading || "Eco-Resilience & Green Certification"}</h2>
              </div>
              <span className="text-xs font-mono uppercase px-3 py-1.5 border rounded-lg flex items-center gap-1.5" style={{ borderColor: t.accent, color: t.accent }}>
                <Leaf className="w-4 h-4" /> {rating || "IGBC Pre-Certified Gold"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features?.map((f: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-xl p-5">
                  <span className="text-xs font-mono uppercase tracking-wider block mb-2" style={{ color: t.accent }}>{f.title}</span>
                  <p className="text-xs font-light leading-relaxed" style={{ color: t.muted }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 12. MASTER PLAN & SITE LAYOUT
    MasterPlanLayout: {
      render: ({ heading, mapUrl, zones, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>10 // Spatial Zoning</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8">{heading || "7.5-Acre Master Site Plan"}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div 
                className="lg:col-span-2 h-[340px] sm:h-[460px] border rounded-2xl bg-cover bg-center shadow-xl" 
                style={{ borderColor: t.border, backgroundImage: `url(${mapUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"})` }} 
              />
              <div className="space-y-4">
                {zones?.map((z: any, i: number) => (
                  <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-xl p-4">
                    <span className="text-xs font-mono block mb-1" style={{ color: t.accent }}>Zone 0{i + 1} — {z.name}</span>
                    <p className="text-xs font-light" style={{ color: t.muted }}>{z.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      },
    },

    // 13. ROI CALCULATOR & CAPITAL APPRECIATION
    RoiCalculatorCard: {
      render: ({ heading, subtitle, projections, whatsappNumber, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        const waLink = getWhatsAppUrl(whatsappNumber, "Hi, I would like to request the detailed ROI analysis for Mahalunge.");
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <div className="max-w-4xl mx-auto border rounded-2xl p-8 sm:p-12 shadow-2xl" style={{ backgroundColor: t.bg, borderColor: t.border }}>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase px-3 py-1 border rounded mb-4" style={{ borderColor: t.border, color: t.accent }}>
                <Calculator className="w-3.5 h-3.5" /> Investment Thesis
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Capital Appreciation & Yield Forecast"}</h2>
              <p className="text-xs sm:text-sm font-light mb-8" style={{ color: t.muted }}>{subtitle || "Projected financial upside driven by Hinjawadi Phase 1 expansion and the Mahalunge-Maan Hi-Tech City corridor."}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {projections?.map((p: any, i: number) => (
                  <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-xl p-5 text-center">
                    <span className="text-2xl sm:text-3xl font-serif font-light block" style={{ color: t.accent }}>{p.value}</span>
                    <span className="text-xs font-mono uppercase tracking-wider block mt-1">{p.label}</span>
                    <span className="text-[10px] font-mono block mt-0.5" style={{ color: t.muted }}>{p.timeline}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: t.accent, color: t.bg }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 font-mono font-semibold uppercase tracking-widest text-xs rounded-lg hover:opacity-90 transition shadow-lg"
                >
                  <TrendingUp className="w-4 h-4" /> Request Comprehensive ROI Sheet
                </a>
              </div>
            </div>
          </section>
        );
      },
    },

    // 14. NEIGHBORHOOD & LOCALITY HIGHLIGHTS
    NeighborhoodVibe: {
      render: ({ heading, microMarket, categories, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>11 // The Micro-Market</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Mahalunge Enclave Ecosystem"}</h2>
            <p className="text-xs sm:text-sm font-light mb-8" style={{ color: t.muted }}>Strategic growth cluster situated immediately adjacent to Hinjawadi and Baner.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories?.map((cat: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-xl p-6">
                  <h4 className="text-xs font-mono uppercase tracking-widest mb-4 pb-2 border-b" style={{ borderColor: t.border, color: t.accent }}>{cat.name}</h4>
                  <div className="space-y-3">
                    {cat.places?.map((place: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span style={{ color: t.text }}>{place.name}</span>
                        <span className="font-mono" style={{ color: t.muted }}>{place.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 15. CONNECTIVITY MATRIX
    ConnectivityMatrix: {
      render: ({ address, lat, lng, hubs, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        const safeLat = typeof lat === "number" ? lat : 18.5721;
        const safeLng = typeof lng === "number" ? lng : 73.7482;

        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>12 // Strategic Commute</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{address}</h2>
            <p className="text-xs font-mono mb-8" style={{ color: t.muted }}>COORDINATES: {safeLat}° N, {safeLng}° E</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-[340px] sm:h-[440px] border rounded-2xl overflow-hidden shadow-xl" style={{ borderColor: t.border }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  title="Location Map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${safeLng - 0.02}%2C${safeLat - 0.02}%2C${safeLng + 0.02}%2C${safeLat + 0.02}&layer=mapnik&marker=${safeLat}%2C${safeLng}`} 
                />
              </div>
              <div style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-widest mb-4 pb-2 border-b" style={{ borderColor: t.border, color: t.accent }}>Transit Times</h4>
                  <div className="space-y-3.5">
                    {hubs?.map((hub: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs py-1 border-b" style={{ borderColor: `${t.border}80` }}>
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

    // 16. ARCHITECT'S PHILOSOPHY & SIGNATURE
    ArchitectNotes: {
      render: ({ architectName, studio, quote, bio, portraitUrl, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 border rounded-2xl p-8 sm:p-12 shadow-2xl" style={{ backgroundColor: t.surface, borderColor: t.border }}>
              <div 
                className="w-32 h-32 md:w-44 md:h-44 rounded-full border-2 bg-cover bg-center flex-shrink-0 shadow-lg" 
                style={{ borderColor: t.accent, backgroundImage: `url(${portraitUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"})` }} 
              />
              <div>
                <Quote className="w-8 h-8 mb-4 opacity-50" style={{ color: t.accent }} />
                <p className="text-base sm:text-xl font-serif italic mb-6 leading-relaxed" style={{ color: t.text }}>"{quote || "A sovereign home is not merely a residential structure, but an enduring canvas for generational peace."}"</p>
                <h4 className="text-sm font-mono uppercase tracking-wider font-semibold" style={{ color: t.accent }}>{architectName || "Chief Design Architect"}</h4>
                <span className="text-xs font-mono block" style={{ color: t.muted }}>{studio || "K Raheja Design Studio"}</span>
              </div>
            </div>
          </section>
        );
      },
    },

    // 17. INVESTOR ENDORSEMENTS & TESTIMONIALS
    TestimonialCards: {
      render: ({ heading, reviews, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>13 // Buyer Endorsements</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8">{heading || "Voices of Our Patrons"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews?.map((r: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" style={{ color: t.accent }} />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm font-light leading-relaxed mb-6" style={{ color: t.muted }}>"{r.comment}"</p>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: t.border }}>
                    <div>
                      <span className="text-xs font-mono font-medium block" style={{ color: t.text }}>{r.name}</span>
                      <span className="text-[10px] font-mono block" style={{ color: t.muted }}>{r.unit}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 border rounded" style={{ borderColor: t.border, color: t.accent }}>Verified HNI</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 18. CURATED PHOTO MASONRY GALLERY
    GalleryGrid: {
      render: ({ heading, images, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>14 // Visual Archive</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8">{heading || "Architectural Perspectives"}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images?.map((img: any, i: number) => (
                <div 
                  key={i} 
                  className={`h-64 sm:h-80 rounded-xl border bg-cover bg-center transition-all duration-500 hover:scale-[1.02] shadow-lg ${i === 0 ? "sm:col-span-2" : ""}`}
                  style={{ borderColor: t.border, backgroundImage: `url(${img.url})` }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-black/80 via-transparent p-4 flex items-end rounded-xl">
                    <span className="text-xs font-mono text-white/90">{img.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 19. VIRTUAL TOUR & 3D WALKTHROUGH
    VideoShowcase: {
      render: ({ heading, subtitle, thumbnailUrl, videoUrl, whatsappNumber, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        const waLink = getWhatsAppUrl(whatsappNumber, "Hi, please share the 360 virtual tour link for Raheja Vistas.");
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <div className="max-w-5xl mx-auto text-center">
              <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>15 // Immersive Media</span>
              <h2 className="text-2xl sm:text-4xl font-serif font-light mb-2">{heading || "360° Sample Residence Walkthrough"}</h2>
              <p className="text-xs sm:text-sm font-light mb-8 max-w-xl mx-auto" style={{ color: t.muted }}>{subtitle || "Experience the architectural scale, natural light orientation, and finish materials virtually."}</p>

              <div 
                className="relative w-full h-[320px] sm:h-[480px] border rounded-2xl bg-cover bg-center overflow-hidden flex items-center justify-center shadow-2xl" 
                style={{ borderColor: t.border, backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${thumbnailUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85"})` }}
              >
                <a 
                  href={videoUrl || waLink} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ backgroundColor: t.accent, color: t.bg }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95"
                >
                  <Video className="w-8 h-8 ml-1" />
                </a>
              </div>
            </div>
          </section>
        );
      },
    },

    // 20. AWARDS & INDUSTRY RECOGNITION
    AwardsAccolades: {
      render: ({ heading, awards, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2 text-center" style={{ color: t.accent }}>16 // Excellence Recognized</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-8 text-center">{heading || "National Design & Real Estate Honors"}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {awards?.map((a: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.surface, borderColor: t.border }} className="border rounded-xl p-6 text-center">
                  <Award className="w-8 h-8 mx-auto mb-3" style={{ color: t.accent }} />
                  <h4 className="text-sm font-serif font-light mb-1">{a.title}</h4>
                  <span className="text-xs font-mono block mb-2" style={{ color: t.accent }}>{a.year}</span>
                  <p className="text-[11px] font-light" style={{ color: t.muted }}>{a.organization}</p>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 21. COMPETITIVE BENCHMARK / COMPARISON TABLE
    ComparisonTable: {
      render: ({ heading, subtitle, criteria, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>17 // Market Benchmark</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Why Raheja Vistas Commands Prestige"}</h2>
            <p className="text-xs sm:text-sm font-light mb-8" style={{ color: t.muted }}>{subtitle || "Comparing master planning metrics against general Mahalunge developments."}</p>

            <div className="max-w-4xl border rounded-xl overflow-hidden" style={{ borderColor: t.border, backgroundColor: t.bg }}>
              <div className="grid grid-cols-3 p-4 border-b font-mono text-xs uppercase" style={{ borderColor: t.border, color: t.accent }}>
                <span>Parameters</span>
                <span>Raheja Vistas</span>
                <span style={{ color: t.muted }}>Standard Market</span>
              </div>
              {criteria?.map((c: any, i: number) => (
                <div key={i} className="grid grid-cols-3 p-4 border-b text-xs last:border-0 items-center" style={{ borderColor: `${t.border}60` }}>
                  <span className="font-mono" style={{ color: t.text }}>{c.feature}</span>
                  <span className="font-medium flex items-center gap-1.5" style={{ color: t.accent }}>
                    <Check className="w-3.5 h-3.5" /> {c.raheja}
                  </span>
                  <span style={{ color: t.muted }}>{c.other}</span>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    // 22. OFFICIAL DIGITAL PROJECT VAULT (GOOGLE DRIVE)
    ProjectVault: {
      render: ({ heading, description, driveUrl, buttonLabel, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-12 md:p-16 border-b text-center">
            <div className="max-w-3xl mx-auto border rounded-2xl p-8 sm:p-12 shadow-2xl" style={{ backgroundColor: t.surface, borderColor: t.border }}>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1 border rounded mb-4" style={{ borderColor: t.border, color: t.accent }}>
                <FolderDown className="w-3.5 h-3.5" /> Official Digital Repository
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-light mb-4" style={{ color: t.text }}>
                {heading || "Sanctioned Blueprints & Document Vault"}
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

    // 23. INVESTOR FAQ ACCORDION
    FAQSection: {
      render: ({ heading, subtitle, items, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        return (
          <section style={{ backgroundColor: t.surface, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b">
            <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>18 // Due Diligence</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light mb-2">{heading || "Frequently Asked Questions"}</h2>
            <p className="text-xs sm:text-sm font-light mb-8" style={{ color: t.muted }}>{subtitle || "Essential investor clarity on payment structures, possession, and legal compliance."}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              {items?.map((faq: any, i: number) => (
                <div key={i} style={{ backgroundColor: t.bg, borderColor: t.border }} className="border rounded-xl p-6">
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

    // 24. VIP SITE VISIT & PRIVATE APPOINTMENT
    LeadForm: {
      render: ({ heading, subtitle, whatsappNumber, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        const waLink = getWhatsAppUrl(whatsappNumber, "Hi, I would like to schedule a private VIP site walkthrough at Raheja Vistas.");
        return (
          <section style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-6 sm:p-10 md:p-16 border-b text-center">
            <div className="max-w-2xl mx-auto border rounded-2xl p-8 sm:p-10 shadow-2xl" style={{ backgroundColor: t.surface, borderColor: t.border }}>
              <span className="text-xs font-mono uppercase tracking-widest block mb-2" style={{ color: t.accent }}>19 // Private Access</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light mb-3">{heading || "Schedule an Executive Site Walkthrough"}</h2>
              <p className="text-xs sm:text-sm font-light mb-8" style={{ color: t.muted }}>{subtitle || "Reserve dedicated advisory consultation and sample suite preview with senior relationship management."}</p>
              
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: t.accent, color: t.bg }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-mono font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition rounded-lg shadow-lg"
              >
                <Calendar className="w-4 h-4" /> Book VIP Appointment on WhatsApp
              </a>
            </div>
          </section>
        );
      },
    },

    // 25. DEVELOPER TRUST & CORPORATE HERITAGE
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
                  <span className="text-xl sm:text-2xl font-mono block" style={{ color: t.accent }}>{legacyYears || "65+"} Years</span>
                  <span className="text-[10px] sm:text-xs uppercase font-mono" style={{ color: t.muted }}>Legacy</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-mono block" style={{ color: t.accent }}>{totalDeliveredSqft || "50M+"} Sq.Ft.</span>
                  <span className="text-[10px] sm:text-xs uppercase font-mono" style={{ color: t.muted }}>Delivered</span>
                </div>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: t.accent, color: t.bg }}
                className="inline-flex items-center gap-2 px-8 py-4 font-mono font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition rounded-lg shadow-lg"
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

    // 26. CONCIERGE & DIRECT CONTACT FOOTER
    ContactFooter: {
      render: ({ advisorName, phone, location, email, hours, theme }) => {
        const t = theme || { bg: "#09090b", surface: "#121215", text: "#fafafa", muted: "#a1a1aa", accent: "#facc15", border: "#27272a" };
        const waLink = getWhatsAppUrl(phone, "Hi, I am reaching out from the Raheja Vistas digital showcase.");
        return (
          <footer style={{ backgroundColor: t.bg, color: t.text, borderColor: t.border }} className="p-8 sm:p-12 border-t">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest block mb-1" style={{ color: t.accent }}>Executive Concierge</span>
                <h4 className="text-lg font-serif font-light">{advisorName || "Mithilesh Nikose"}</h4>
                <p className="text-xs font-mono" style={{ color: t.muted }}>{location || "Near Mahalunge Circle, Pune 411045"}</p>
              </div>
              <div className="flex gap-4">
                <a
                  href={`tel:${phone || "+919373810916"}`}
                  style={{ borderColor: t.border, color: t.text }}
                  className="border px-4 py-2 text-xs font-mono uppercase rounded-lg flex items-center gap-1.5 hover:border-white transition"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Advisor
                </a>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: t.accent, color: t.bg }}
                  className="px-5 py-2 text-xs font-mono uppercase font-semibold rounded-lg flex items-center gap-1.5 hover:opacity-90 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Direct
                </a>
              </div>
            </div>
          </footer>
        );
      },
    },
  },
};

export default config;
