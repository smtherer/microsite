"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Loader2, 
  Link as LinkIcon, 
  FileText, 
  Wand2, 
  PhoneCall, 
  CheckCircle, 
  ExternalLink,
  Copy,
  Globe
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"studio" | "scraper" | "vault">("studio");
  const [brochureText, setBrochureText] = useState("");
  const [designVibe, setDesignVibe] = useState("Modern shadcn dark zinc (#09090b) with vibrant canary yellow (#facc15)");
  const [whatsappNumber, setWhatsappNumber] = useState("+91");
  const [scrapedImages, setScrapedImages] = useState<string[]>([]);
  
  const [scrapeInput, setScrapeInput] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  async function handleExtract(type: "input" | "file") {
    setExtracting(true);
    try {
      const formData = new FormData();
      if (type === "input") formData.append("input", scrapeInput);
      if (type === "file" && pdfFile) formData.append("file", pdfFile);
  
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract");
  
      setBrochureText(data.extractedData);
      setScrapedImages(data.scrapedImages || []);
      setActiveTab("studio");
      setScrapeInput("");
      setPdfFile(null);
    } catch (err: any) {
      alert("Extraction Error: " + err.message);
    } finally {
      setExtracting(false);
    }
  }

  async function handleGenerate(andPublish: boolean = false) {
    if (!brochureText.trim()) return;
    setGenerating(true);
    setPublishedUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          brochureInput: brochureText, 
          designVibe,
          whatsappNumber,
          scrapedImages
        }),
      });

      const puckPayload = await res.json();
      if (!res.ok) throw new Error(puckPayload.error);

      localStorage.setItem("current_microsite_data", JSON.stringify(puckPayload));

      if (andPublish) {
        setPublishing(true);
        const nameMatch = brochureText.match(/Project:\s*([^\n\r]+)/i);
        const projectName = nameMatch ? nameMatch[1].trim() : "Project";

        const pubRes = await fetch("/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ puckData: puckPayload, projectName }),
        });
        const pubData = await pubRes.json();
        if (!pubRes.ok) throw new Error(pubData.error);

        setPublishedUrl(pubData.url);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      alert("Pipeline Error: " + err.message);
    } finally {
      setGenerating(false);
      setPublishing(false);
    }
  }

  function copyToClipboard(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] p-4 sm:p-8 md:p-12 font-sans flex justify-center items-center">
      <div className="w-full max-w-4xl border border-zinc-800 p-6 sm:p-10 bg-[#121215] rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-zinc-800 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-light text-white tracking-wide">Microsite Studio</h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">Autonomous Real Estate Dossier Engine</p>
          </div>
          {scrapedImages.length > 0 && (
            <span className="text-[11px] font-mono px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> {scrapedImages.length} Visual Assets Cached
            </span>
          )}
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-zinc-800 my-6">
          <button 
            type="button"
            onClick={() => setActiveTab("studio")} 
            className={`pb-3 text-xs uppercase font-mono tracking-widest flex-1 text-center flex items-center justify-center gap-2 transition ${activeTab === 'studio' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Wand2 className="w-3.5 h-3.5" /> Design Studio
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("scraper")} 
            className={`pb-3 text-xs uppercase font-mono tracking-widest flex-1 text-center flex items-center justify-center gap-2 transition ${activeTab === 'scraper' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Project Scraper
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("vault")} 
            className={`pb-3 text-xs uppercase font-mono tracking-widest flex-1 text-center flex items-center justify-center gap-2 transition ${activeTab === 'vault' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <FileText className="w-3.5 h-3.5" /> PDF Vault
          </button>
        </div>

        {/* TAB 1: STUDIO */}
        {activeTab === "studio" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-zinc-400 block mb-2 font-mono">
                  Theme Palette
                </label>
                <input
                  type="text"
                  value={designVibe}
                  onChange={(e) => setDesignVibe(e.target.value)}
                  className="w-full bg-[#09090b] border border-zinc-800 p-3 text-xs font-mono text-zinc-200 rounded focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-zinc-400 block mb-2 font-mono flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" /> WhatsApp Lead Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+9198XXXXXXXX"
                  className="w-full bg-[#09090b] border border-zinc-800 p-3 text-xs font-mono text-amber-400 rounded focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-widest text-zinc-400 block mb-2 font-mono">
                Project Dossier & Extracted Intelligence
              </label>
              <textarea
                rows={9}
                value={brochureText}
                onChange={(e) => setBrochureText(e.target.value)}
                placeholder="Data imported from Scraper/PDF will appear here..."
                className="w-full bg-[#09090b] border border-zinc-800 p-4 text-xs font-mono text-zinc-200 rounded focus:outline-none focus:border-zinc-500 resize-none leading-relaxed"
              />
            </div>

            {/* Published Success Banner */}
            {publishedUrl && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-300">Live URL: {publishedUrl}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => copyToClipboard(publishedUrl)}
                    className="flex-1 sm:flex-initial px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono rounded flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
                  </button>
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial px-3 py-1.5 bg-emerald-400 text-black text-xs font-mono font-medium rounded flex items-center justify-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={generating || publishing || !brochureText.trim()}
                className="flex-1 bg-white hover:bg-zinc-200 text-black py-4 uppercase tracking-widest text-xs font-semibold rounded flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {generating && !publishing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> DeepSeek is Architecting...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Open In Puck Editor</>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(true)}
                disabled={generating || publishing || !brochureText.trim()}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-black py-4 uppercase tracking-widest text-xs font-semibold rounded flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {publishing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing Live...</>
                ) : (
                  <><Globe className="w-4 h-4" /> One-Click Publish Live</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SCRAPER */}
        {activeTab === "scraper" && (
          <div className="py-8 text-center max-w-lg mx-auto">
            <h2 className="text-xl font-serif font-light mb-2">Project Scraper & Research</h2>
            <p className="text-xs text-zinc-400 mb-6 font-light">
              Enter any builder landing URL or a project name (e.g. <em>"Mahindra Lifespaces Mahalunge"</em>).
            </p>
            <textarea
              rows={3}
              value={scrapeInput}
              onChange={(e) => setScrapeInput(e.target.value)}
              placeholder="Enter URL or 'Project Name Pune'..."
              className="w-full bg-[#09090b] border border-zinc-800 p-3 text-xs font-mono text-zinc-200 rounded focus:outline-none focus:border-zinc-500 mb-6 resize-none"
            />
            <button
              type="button"
              onClick={() => handleExtract("input")}
              disabled={extracting || !scrapeInput.trim()}
              className="w-full sm:w-auto bg-[#18181b] border border-zinc-700 text-amber-400 px-8 py-3 text-xs uppercase font-mono tracking-widest hover:bg-white hover:text-black transition rounded disabled:opacity-50"
            >
              {extracting ? "Researching & Scraping Renders..." : "Scrape & Populate Studio"}
            </button>
          </div>
        )}

        {/* TAB 3: PDF VAULT */}
        {activeTab === "vault" && (
          <div className="py-8 text-center max-w-lg mx-auto">
            <h2 className="text-xl font-serif font-light mb-2">Brochure PDF Vault</h2>
            <p className="text-xs text-zinc-400 mb-6 font-light">
              Upload developer PDF brochures to parse configurations, areas, and amenities.
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mx-auto block text-xs font-mono text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-widest file:bg-zinc-800 file:text-amber-400 hover:file:bg-white hover:file:text-black cursor-pointer mb-6"
            />
            <button
              type="button"
              onClick={() => handleExtract("file")}
              disabled={extracting || !pdfFile}
              className="w-full sm:w-auto bg-[#18181b] border border-zinc-700 text-amber-400 px-8 py-3 text-xs uppercase font-mono tracking-widest hover:bg-white hover:text-black transition rounded disabled:opacity-50"
            >
              {extracting ? "Parsing Document..." : "Parse PDF & Populate Studio"}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}