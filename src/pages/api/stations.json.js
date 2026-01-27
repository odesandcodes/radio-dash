export const prerender = false;

export async function GET() {
  const headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
  };

  const fetchStation = async (url) => {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(4000) });
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  };

  const [wqxr, kusc, wfmt] = await Promise.all([
    fetchStation('https://api.wnyc.org/api/v1/whats_on/wqxr/'),
    fetchStation('https://kuscapi.org/api/playlist/current'),
    fetchStation('https://www.wfmt.com/wp-json/wfmt/v1/playlist/current')
  ]);

  const data = {
    wqxr: { 
      title: wqxr?.current_playlist_item?.catalog_entry?.title || wqxr?.current_show?.title || "Live Broadcast", 
      comp: wqxr?.current_playlist_item?.catalog_entry?.composer?.name || "WQXR New York" 
    },
    kusc: { 
      title: kusc?.title || "Live Broadcast", 
      comp: kusc?.composer || "KUSC Los Angeles" 
    },
    kdfc: { 
      title: kusc?.title || "Live Broadcast", 
      comp: kusc?.composer || "KDFC San Francisco" 
    },
    wfmt: { 
      title: (Array.isArray(wfmt) ? wfmt[0]?.title : wfmt?.title) || "Live Broadcast", 
      comp: (Array.isArray(wfmt) ? wfmt[0]?.composer : wfmt?.composer) || "WFMT Chicago" 
    }
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
  });
}