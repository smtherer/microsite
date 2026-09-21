import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "Mahindra Mahalunge";

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return new Response(
      `<body style="background:#09090b;color:#ef4444;font-family:sans-serif;padding:32px;">
        <h2>❌ SERPER_API_KEY is missing from process.env</h2>
        <p style="color:#a1a1aa;">Check your <code>.env.local</code> file and restart the dev server (<code>npm run dev</code>).</p>
      </body>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  let rawImages: any[] = [];
  let apiStatus = 200;
  let apiError = "";
  let finalQueryUsed = "";

  // Strategy 1: Project-specific search
  finalQueryUsed = `${query} Pune residential project`;
  try {
    let res = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: finalQueryUsed,
        gl: "in",
        hl: "en",
        num: 15,
      }),
    });

    apiStatus = res.status;
    if (res.ok) {
      const data = await res.json();
      rawImages = data.images || [];
    } else {
      apiError = await res.text();
    }

    // Strategy 2: If 0 results (unreleased land parcel), fallback to developer + micro-market
    if (rawImages.length === 0 && res.ok) {
      finalQueryUsed = `${query} Pune`;
      const fallbackRes = await fetch("https://google.serper.dev/images", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: finalQueryUsed,
          gl: "in",
          hl: "en",
          num: 15,
        }),
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        rawImages = fallbackData.images || [];
      }
    }
  } catch (err: any) {
    apiError = err.message;
  }

  // Filter out tiny icons and SVGs, but allow valid images
  const filteredImages = rawImages.filter((img) => {
    const url = (img.imageUrl || "").toLowerCase();
    return (
      url.startsWith("http") &&
      !url.includes(".svg") &&
      !url.includes("avatar") &&
      !url.includes("favicon") &&
      !url.includes("logo")
    );
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Image Extractor Diagnostic: ${query}</title>
      <style>
        body { background: #09090b; color: #fff; font-family: -apple-system, sans-serif; padding: 32px; }
        .meta { background: #18181b; border: 1px solid #27272a; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; font-family: monospace; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .card { background: #18181b; border: 1px solid #27272a; border-radius: 8px; overflow: hidden; }
        img { width: 100%; height: 210px; object-fit: cover; display: block; background: #27272a; }
        .info { padding: 12px; font-size: 12px; word-break: break-all; color: #a1a1aa; }
        .badge { background: #eab308; color: #000; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
      </style>
    </head>
    <body>
      <h1>Scraped Renders for: <span style="color:#eab308;">${query}</span></h1>
      
      <div class="meta">
        <div><strong>API Status:</strong> ${apiStatus} ${apiError ? `<span style="color:#ef4444;">(${apiError})</span>` : "✅ OK"}</div>
        <div><strong>Query Sent:</strong> "${finalQueryUsed}"</div>
        <div><strong>Raw Images Returned:</strong> ${rawImages.length} | <strong>Filtered Valid:</strong> ${filteredImages.length}</div>
      </div>

      <div class="grid">
        ${
          filteredImages.length === 0
            ? `<div style="grid-column: 1/-1; padding: 24px; background: #27272a; border-radius: 8px;">
                 <h3 style="color:#ef4444; margin: 0 0 8px 0;">No Valid Images Found</h3>
                 <p style="color:#a1a1aa; margin: 0;">Try testing with a delivered project that has indexed images, e.g.:</p>
                 <ul style="margin: 8px 0 0 0; padding-left: 20px; color:#eab308;">
                   <li><a href="?q=Lodha Belmondo" style="color:#eab308;">?q=Lodha Belmondo</a></li>
                   <li><a href="?q=Godrej Prana Undri" style="color:#eab308;">?q=Godrej Prana Undri</a></li>
                   <li><a href="?q=Nyati Elite Undri" style="color:#eab308;">?q=Nyati Elite Undri</a></li>
                 </ul>
               </div>`
            : filteredImages
                .map(
                  (img, i) => `
          <div class="card">
            <img src="${img.imageUrl}" alt="${img.title || "Image"}" onerror="this.src='https://placehold.co/600x400/18181b/a1a1aa?text=Image+Blocked';" />
            <div class="info">
              <span class="badge">#${i + 1}</span> <strong>${img.title || "Render"}</strong><br/><br/>
              <code>${img.imageUrl}</code>
            </div>
          </div>
        `
                )
                .join("")
        }
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}