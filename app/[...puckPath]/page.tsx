import { Client } from "./client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { head } from "@vercel/blob";

// Helper to fetch the Puck JSON from Vercel Blob
async function getPuckData(slug: string) {
  try {
    // Check if the file exists in Vercel Blob
    const blob = await head(`microsites/${slug}.json`);
    if (!blob || !blob.url) return null;

    // Fetch the raw JSON contents
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}): Promise<Metadata> {
  const { puckPath = [] } = await params;
  const slug = puckPath.filter(Boolean).pop() || "default";
  const data = await getPuckData(slug);

  return {
    title:
      data?.root?.props?.title ||
      data?.content?.[0]?.props?.projectName ||
      "Luxury Real Estate Microsite",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ puckPath: string[] }>;
}) {
  const { puckPath = [] } = await params;
  // Extracts the slug cleanly whether the URL is /godrej-prana or /p/godrej-prana
  const slug = puckPath.filter(Boolean).pop() || "default";
  const data = await getPuckData(slug);

  if (!data) {
    return notFound();
  }

  return <Client data={data} />;
}

// Set to force-dynamic so newly published microsites appear immediately without rebuilding the site
export const dynamic = "force-dynamic";
