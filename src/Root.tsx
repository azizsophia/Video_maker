import React from "react";
import { Composition } from "remotion";
import {
  QuranComposition,
  FPS,
  totalDurationInFrames,
} from "./QuranVideo/QuranComposition";
import { quranPropsSchema, QuranProps } from "./QuranVideo/schema";
import sampleData from "./data/sample-al-ikhlas.json";

const defaultProps = sampleData as unknown as QuranProps;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vertical 9:16 for YouTube Shorts / TikTok / Reels */}
      <Composition
        id="QuranRecitation"
        component={QuranComposition}
        schema={quranPropsSchema}
        defaultProps={defaultProps}
        fps={FPS}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(1, totalDurationInFrames(props)),
        })}
      />

      {/* Horizontal 16:9 variant for standard YouTube */}
      <Composition
        id="QuranRecitationWide"
        component={QuranComposition}
        schema={quranPropsSchema}
        defaultProps={defaultProps}
        fps={FPS}
        width={1920}
        height={1080}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(1, totalDurationInFrames(props)),
        })}
      />
    </>
  );
};
