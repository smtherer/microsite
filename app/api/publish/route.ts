import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Simple helper to create URL-safe slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    const { puckData, projectName } = await req.json();

    if (!puckData || !puckData.content) {
      return NextResponse.json(
        { error: "Invalid Puck data provided." },
        { status: 400 }
      );
    }

    const slug = slugify(projectName || "project-" + Date.now());

    // Upload directly to Vercel Blob cloud storage
    const blob = await put(`microsites/${slug}.json`, JSON.stringify(puckData), {
      access: "public",
      addRandomSuffix: false, // Keeps the URL predictable
    });

    return NextResponse.json({
      success: true,
      slug,
      url: `/${slug}`,
      blobUrl: blob.url,
    });
  } catch (err: any) {
    console.error("Publishing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
