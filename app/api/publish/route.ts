import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
      return NextResponse.json({ error: "Invalid Puck data provided." }, { status: 400 });
    }

    const slug = slugify(projectName || "project-" + Date.now());

    // Storage: If using MongoDB, updateOne({ slug }, { data: puckData }, { upsert: true })
    // For instant filesystem storage (works immediately in local / Docker):
    const storageDir = path.join(process.cwd(), "data", "microsites");
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(storageDir, `${slug}.json`),
      JSON.stringify(puckData, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      slug,
      url: `/p/${slug}`,
    });
  } catch (err: any) {
    console.error("Publishing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}