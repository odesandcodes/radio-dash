
// The "Secret" lives only here on the server
const SERVER_SECRET = "joshua"; 

export async function GET({ request }) {
  const url = new URL(request.url);
  const userKey = url.searchParams.get('key');
  const stationId = url.searchParams.get('id');

  // Hardcoded server-side check
  if (userKey !== SERVER_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 403,
        headers: { "Content-Type": "application/json" }
    });
  }

  const fetchStation = async (u) => {
    try {
      const res = await fetch(u, { signal: AbortSignal.timeout(3000) });
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  };

  let result = { title: "Live", comp: "Radio-Dash" };

  if (stationId === 'wqxr') {
    const d = await fetchStation('https://api.wnyc.org/api/v1/whats_on/wqxr/');
    result = { title: d?.current_playlist_item?.catalog_entry?.title || "Live", comp: d?.current_playlist_item?.catalog_entry?.composer?.name || "WQXR" };
  } else if (stationId === 'swiss') {
    const d = await fetchStation('https://www.radioswissclassic.ch/it/api/playlist/current-track.json');
    result = { title: d?.title || "Classical Gems", comp: d?.artist || "Swiss Classic" };
  } else if (['salad', 'deep', 'blender'].includes(stationId)) {
    const d = await fetchStation('https://somafm.com/channels.json');
    const idMap = { salad: 'groovesalad', deep: 'deepspaceone', blender: 'beatblender' };
    const chan = d?.channels?.find(c => c.id === idMap[stationId]);
    result = { title: chan?.lastPlaying || "Ambient Beats", comp: "SomaFM" };
  }

  return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
}