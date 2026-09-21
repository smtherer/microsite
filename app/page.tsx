"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Render } from "@puckeditor/core"
import { config } from "../puck.config"
import { Globe, ArrowLeft, Loader2, Copy, ExternalLink, Check } from "lucide-react";

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("current_microsite_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cached microsite data", e);
      }
    }
  }, []);

  async function handlePublish() {
    if (!data) return;
    setPublishing(true);
    try {
      const heroBlock = data.content?.find((b: any) => b.type === "HeroSection");
      const projectName = heroBlock?.props?.projectName || "project";

      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puckData: data, projectName }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Publish failed");

      setPublishedUrl(resData.url);
    } catch (err: any) {
      alert("Publishing error: " + err.message);
    } finally {
      setPublishing(false);
    }
  }

  function copyLink() {
    if (!publishedUrl) return;
    navigator.clipboard.writeText(window.location.origin + publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <h1 className="text-2xl font-serif mb-3">No Microsite Generated Yet</h1>
        <p className="text-xs font-mono text-zinc-400 mb-6">
          Head over to the Studio to scrape or import a project dossier first.
        </p>
        <Link
          href="/admin"
          className="px-6 py-3 bg-amber-400 text-black text-xs font-mono uppercase tracking-widest font-semibold rounded hover:bg-amber-300 transition"
        >
          Open Admin Studio
        </Link>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#09090b]">
      {/* Floating Top Control Bar */}
      <nav className="sticky top-0 z-50 w-full bg-[#121215]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between font-sans">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
          </Link>
          <span className="hidden sm:inline-block h-4 w-px bg-zinc-800" />
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
            Preview Mode
          </span>
        </div>

        {/* Publish Action / Live Link Display */}
        <div className="flex items-center gap-3">
          {publishedUrl ? (
            <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded text-xs font-mono text-emerald-300">
              <span className="truncate max-w-[150px] sm:max-w-none">{publishedUrl}</span>
              <button
                onClick={copyLink}
                className="hover:text-white transition flex items-center gap-1 ml-2"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition flex items-center gap-1 ml-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono uppercase tracking-widest font-semibold rounded flex items-center gap-2 transition disabled:opacity-50"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" /> Publish Live
                </>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Rendered Live Microsite */}
      <Render config={config} data={data} />
    </div>
  );
}