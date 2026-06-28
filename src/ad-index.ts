import { registerRoot } from "remotion";
import React from "react";
import { Composition } from "remotion";
import { ParallaxAd } from "./QuranVideo/ParallaxAd";
import { KeepsakeAd } from "./QuranVideo/KeepsakeAd";

// Minimal root for the waitlist ads — kept separate from the video compositions
// so the bundle never pulls gstatic webfonts through the proxy.
const AdRoot: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, {
      id: "ParallaxAd",
      component: ParallaxAd,
      fps: 30,
      durationInFrames: 240,
      width: 1080,
      height: 1920,
      defaultProps: {},
    }),
    React.createElement(Composition, {
      id: "KeepsakeAd",
      component: KeepsakeAd,
      fps: 30,
      durationInFrames: 240,
      width: 1080,
      height: 1920,
      defaultProps: {},
    })
  );

registerRoot(AdRoot);
