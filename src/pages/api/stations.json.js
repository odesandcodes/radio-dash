export const prerender = false;

export async function GET() {
  const fetchStation = async (url) => {
    try {
      const res = await fetch(url, { 
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000) 
      });
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  };

  const [wqxr, kusc, wfmt] = await Promise.all([
    fetchStation('https://api.wnyc.org/api/v1/whats_on/wqxr/'),
    fetchStation('https://kuscapi.org/api/playlist/current'),
    // Chicago uses a different feed for their app
    fetchStation('https://www.wfmt.com/wp-json/wfmt/v1/playlist/current')
  ]);

  const data = {
    wqxr: { 
        title: wqxr?.current_playlist_item?.catalog_entry?.title || wqxr?.current_show?.title || "Live Stream", 
        comp: wqxr?.current_playlist_item?.catalog_entry?.composer?.name || "WQXR" 
    },
    kusc: { 
        title: kusc?.title || "Classical California", 
        comp: kusc?.composer || "KUSC" 
    },
    kdfc: { 
        title: kusc?.title || "Classical California", 
        comp: kusc?.composer || "KDFC" 
    },
    wfmt: { 
        title: wfmt?.title || (Array.isArray(wfmt) ? wfmt[0]?.title : "Classical Chicago"), 
        comp: wfmt?.composer || (Array.isArray(wfmt) ? wfmt[0]?.composer : "WFMT") 
    }
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
  });
}