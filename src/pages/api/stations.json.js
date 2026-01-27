export const prerender = false;

export async function GET() {
  const headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json'
  };

  const fetchStation = async (url) => {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  };

  // We hit all three APIs simultaneously
  const [wqxr, kusc, wfmt] = await Promise.all([
    fetchStation('https://api.wnyc.org/api/v1/whats_on/wqxr/'),
    fetchStation('https://kuscapi.org/api/playlist/current'),
    fetchStation('https://www.wfmt.com/wp-json/wfmt/v1/playlist/current')
  ]);

  const data = {
    wqxr: { 
      title: wqxr?.current_playlist_item?.catalog_entry?.title || wqxr?.current_show?.title || "Classical NY", 
      comp: wqxr?.current_playlist_item?.catalog_entry?.composer?.name || "WQXR" 
    },
    kusc: { 
      title: kusc?.title || "Classical LA", 
      comp: kusc?.composer || "KUSC" 
    },
    kdfc: { 
      title: kusc?.title || "Classical SF", 
      comp: kusc?.composer || "KDFC" 
    },
    wfmt: { 
      // WFMT returns an array, we take the first item [0]
      title: (Array.isArray(wfmt) ? wfmt[0]?.title : wfmt?.title) || "Classical Chicago", 
      comp: (Array.isArray(wfmt) ? wfmt[0]?.composer : wfmt?.composer) || "WFMT" 
    }
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
    }
  });
}