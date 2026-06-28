// Search Pexels for portrait clips and print candidates (id, link, thumbnail).
// Key is read from env (PEXELS_API_KEY) — never hard-coded/committed.
const KEY = process.env.PEXELS_API_KEY;
if (!KEY) throw new Error("PEXELS_API_KEY not set");
const queries = process.argv.slice(2);
for (const q of queries) {
  const r = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=12&orientation=portrait&size=medium`,
    { headers: { Authorization: KEY } }
  );
  const j = await r.json();
  for (const v of j.videos || []) {
    const f =
      v.video_files.find((f) => f.width === 1080 && f.height === 1920) ||
      v.video_files.find((f) => f.height >= 1280 && f.height >= f.width) ||
      v.video_files[0];
    console.log(JSON.stringify({ q, id: v.id, dur: v.duration, w: f.width, h: f.height, link: f.link, image: v.image }));
  }
}
