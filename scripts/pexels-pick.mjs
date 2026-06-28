// Search Pexels for portrait candidates and print them (id, link, thumbnail).
// Key is read from env (PEXELS_API_KEY) — never hard-coded/committed.
// Usage:
//   node pexels-pick.mjs "query a" "query b"        # video clips (default)
//   node pexels-pick.mjs --photos "query a" ...     # still photos (for covers)
const KEY = process.env.PEXELS_API_KEY;
if (!KEY) throw new Error("PEXELS_API_KEY not set");
let args = process.argv.slice(2);
const photos = args[0] === "--photos";
if (photos) args = args.slice(1);

for (const q of args) {
  if (photos) {
    const r = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=12&orientation=portrait&size=large`,
      { headers: { Authorization: KEY } }
    );
    const j = await r.json();
    for (const p of j.photos || []) {
      // Request a cover-resolution portrait crop of the original.
      const image = `${p.src.original}?auto=compress&cs=tinysrgb&fit=crop&w=1080&h=1920`;
      console.log(JSON.stringify({ q, id: p.id, w: p.width, h: p.height, alt: p.alt, image }));
    }
    continue;
  }
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
