import { registerRoot } from "remotion";
import React from "react";
import { Composition } from "remotion";
import { Cover } from "./QuranVideo/Cover";

// Minimal root that registers ONLY the cover stills. Keeps the bundle free of
// the video compositions (and their gstatic webfont loaders), so a headless
// render behind the proxy never blocks on Google Fonts.
//
// CoverCard = 9:16 feed / TikTok cover; CoverWide = 16:9 YouTube long-form
// thumbnail. Same Cover component — it adapts its layout via useVideoConfig.
const defaultProps = {
  title: "Two Seas\nThat Never Mix",
  kicker: "QUR'AN & SCIENCE",
  image:
    "https://images.pexels.com/photos/6388945/pexels-photo-6388945.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1080&h=1920",
  wordmark: "KETABI STUDIO",
};

const CoverRoot: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    // durationInFrames is > the scene entrance (frames 0-10) so the cover still
    // can be captured AFTER any animated backdrop (e.g. the night sky) has faded
    // in. A frame-0 still would catch the scene fully transparent (blank).
    React.createElement(Composition, {
      id: "CoverCard",
      component: Cover,
      defaultProps,
      fps: 30,
      durationInFrames: 90,
      width: 1080,
      height: 1920,
    }),
    React.createElement(Composition, {
      id: "CoverWide",
      component: Cover,
      defaultProps,
      fps: 30,
      durationInFrames: 90,
      width: 1920,
      height: 1080,
    })
  );

registerRoot(CoverRoot);
