import { registerRoot } from "remotion";
import React from "react";
import { Composition } from "remotion";
import { ParallaxAd } from "./QuranVideo/ParallaxAd";

// Minimal root for the parallax waitlist ad — kept separate from the video
// compositions so the bundle never pulls gstatic webfonts through the proxy.
const AdRoot: React.FC = () =>
  React.createElement(Composition, {
    id: "ParallaxAd",
    component: ParallaxAd,
    fps: 30,
    durationInFrames: 180,
    width: 1080,
    height: 1920,
  });

registerRoot(AdRoot);
