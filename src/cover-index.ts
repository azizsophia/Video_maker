import { registerRoot } from "remotion";
import React from "react";
import { Composition, registerRoot as _r } from "remotion";
import { Cover } from "./QuranVideo/Cover";

// Minimal root that registers ONLY the cover still. Keeps the bundle free of
// the video compositions (and their gstatic webfont loaders), so a headless
// render behind the proxy never blocks on Google Fonts.
const CoverRoot: React.FC = () =>
  React.createElement(Composition, {
    id: "CoverCard",
    component: Cover,
    defaultProps: {
      title: "Two Seas\nThat Never Mix",
      kicker: "QUR'AN & SCIENCE",
      image:
        "https://images.pexels.com/photos/6388945/pexels-photo-6388945.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1080&h=1920",
      wordmark: "KETABI STUDIO",
    },
    fps: 30,
    durationInFrames: 1,
    width: 1080,
    height: 1920,
  });

registerRoot(CoverRoot);
