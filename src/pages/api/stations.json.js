export async function GET() {
  const urls = {
    wqxr: 'https://api.wnyc.org/api/v1/whats_on/wqxr/',
    kusc: 'https://kuscapi.org/api/playlist/current',
    kdfc: 'https://kuscapi.org/api/playlist/current', // KDFC/KUSC share an API structure
    wfmt: 'https://www.wfmt.com/wp-json/wfmt/v1/playlist/current' 
  };

  try {
    const [wqxrR, kuscR, wfmtR] = await Promise.all([
      fetch(urls.wqxr).then(r => r.json()),
      fetch(urls.kusc).then(r => r.json()),
      fetch(urls.wfmt).then(r => r.json())
    ]);

    return new Response(JSON.stringify({
      wqxr: { title: wqxrR.current_playlist_item?.catalog_entry?.title || "Classical NY", comp: wqxrR.current_playlist_item?.catalog_entry?.composer?.name || "WQXR" },
      kusc: { title: kuscR.title, comp: kuscR.composer },
      kdfc: { title: kuscR.title, comp: kuscR.composer }, // Note: KDFC often shares the KUSC feed metadata
      wfmt: { title: wfmtR.title || "Classical Chicago", comp: wfmtR.composer || "WFMT" }
    }));
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Sync Error' }));
  }
}