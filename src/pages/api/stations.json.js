export const prerender = false;

// The Global Secret
const MASTER_KEY = "joshua"; 

export async function GET({ url }) {
  const stationId = url.searchParams.get('id');
  const userKey = url.searchParams.get('key');
  
  // SECURITY CHECK: Reject if key is missing or wrong
  if (userKey !== MASTER_KEY) {
    return new Response(JSON.stringify({ error: "Shall we play a game? (Unauthorized)" }), { 
        status: 403,
        headers: { "Content-Type": "application/json" }
    });
  }

  if (!stationId) {
    return new Response(JSON.stringify({ error: "No station ID" }), { status: 400 });
  }

  const fetchStation = async (u) => {
    try {
      const res = await fetch(u, { signal: AbortSignal.timeout(3000) });
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  };

  let result = { title: "Live Broadcast", comp: "Connecting..." };

  if (stationId === 'wqxr') {
    const d = await fetchStation('https://api.wnyc.org/api/v1/whats_on/wqxr/');
    result = { 
        title: d?.current_playlist_item?.catalog_entry?.title || "Live Classical", 
        comp: d?.current_playlist_item?.catalog_entry?.composer?.name || "WQXR New York" 
    };
  } 
  else if (stationId === 'swiss') {
    const d = await fetchStation('https://www.radioswissclassic.ch/it/api/playlist/current-track.json');
    result = { 
        title: d?.title || "Classical Gems", 
        comp: d?.artist || "Radio Swiss Classic" 
    };
  } 
  else if (['salad', 'deep', 'blender'].includes(stationId)) {
    const d = await fetchStation('https://somafm.com/channels.json');
    const idMap = { salad: 'groovesalad', deep: 'deepspaceone', blender: 'beatblender' };
    const chan = d?.channels?.find(c => c.id === idMap[stationId]);
    result = { 
        title: chan?.lastPlaying || "Ambient Beats", 
        comp: `SomaFM ${chan?.title || ""}` 
    };
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" }
  });
}