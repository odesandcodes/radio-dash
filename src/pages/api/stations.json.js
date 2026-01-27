export const prerender = false;

export async function GET() {
  const fetchStation = async (url) => {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  };

  const [wqxr, jonathan, soma] = await Promise.all([
    fetchStation('https://api.wnyc.org/api/v1/whats_on/wqxr/'),
    fetchStation('https://api.wnyc.org/api/v1/whats_on/jonathan/'),
    fetchStation('https://somafm.com/channels.json')
  ]);

  // SomaFM sends a list, we have to find our specific channels
  const mission = soma?.channels?.find(c => c.id === 'missioncontrol');
  const lush = soma?.channels?.find(c => c.id === 'lush');

  const data = {
    wqxr: { 
      title: wqxr?.current_playlist_item?.catalog_entry?.title || "Live Broadcast", 
      comp: wqxr?.current_playlist_item?.catalog_entry?.composer?.name || "WQXR" 
    },
    jonathan: { 
      title: jonathan?.current_playlist_item?.catalog_entry?.title || "Great American Songbook", 
      comp: jonathan?.current_playlist_item?.catalog_entry?.composer?.name || "The Jonathan Channel" 
    },
    mission: { 
      title: mission?.lastPlaying || "NASA Space Audio", 
      comp: "Mission Control" 
    },
    lush: { 
      title: lush?.lastPlaying || "Melodic Downtempo", 
      comp: "SomaFM Lush" 
    }
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}