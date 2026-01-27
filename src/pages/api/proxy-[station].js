// src/pages/api/stream.js
export const prerender = false;

export async function GET({ url }) {
  const stationUrl = url.searchParams.get('url');
  if (!stationUrl) return new Response("No URL", { status: 400 });

  // Cloudflare fetches the music for you
  const response = await fetch(stationUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  // We pipe the raw music data directly back to your browser
  return new Response(response.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Access-Control-Allow-Origin": "*"
    }
  });
}