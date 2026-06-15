import { Config } from "@remotion/cli/config";

// Output settings tuned for crisp social-media exports (YouTube Shorts / TikTok).
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);
// High quality is worth the extra size for text-heavy Quran videos.
Config.setCrf(18);
