/**
 * Generate the short CTA voiceover for the parallax ad via ElevenLabs and write
 * it to public/ad/cta.mp3. The Qur'an is never synthesized — this is only the
 * brand/waitlist line.
 *
 * Env:  ELEVENLABS_API_KEY
 * Usage: npx tsx scripts/tts-cta.ts "<line>" [voiceId]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const ELEVEN = "https://api.elevenlabs.io/v1";
const DEFAULT_VOICE = "onwK4e9ZLuTAKqWW03F9"; // Daniel — same as the videos

async function main() {
  const text =
    process.argv[2] ||
    "Your photos, in a hardcover keepsake to treasure forever. Join the waitlist at ketabi studio dot com.";
  const voice = process.argv[3] || DEFAULT_VOICE;
  const key = (process.env.ELEVENLABS_API_KEY || "").trim();
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set.");

  const res = await fetch(`${ELEVEN}/text-to-speech/${voice}`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const dest = "public/ad/cta.mp3";
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`✅ CTA voiceover -> ${dest}\n   "${text}"`);
}

main().catch((e) => {
  console.error("❌ CTA TTS failed:", e.message);
  process.exit(1);
});
