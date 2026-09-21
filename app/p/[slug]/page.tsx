import { notFound } from "next/navigation";
import { Render } from "@puckeditor/core"
import { config } from "../../../puck.config";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getMicrositeData(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "data", "microsites", `${slug}.json`);
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMicrositeData(slug);
  if (!data) return { title: "Project Not Found" };

  const heroBlock = data.content?.find((b: any) => b.type === "HeroSection");
  const title = heroBlock?.props?.projectName || "Luxury Residence";
  const description = heroBlock?.props?.tagline || "Exclusive Residential Showcase";
  const image = heroBlock?.props?.bgImageUrl || "";

  return {
    title: `${title} | Official Digital Dossier`,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
  };
}

export default async function MicrositePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getMicrositeData(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa]">
      <Render config={config} data={data} />
    </main>
  );
}