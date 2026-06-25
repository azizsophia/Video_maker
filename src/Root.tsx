import React from "react";
import { Composition } from "remotion";
import {
  QuranComposition,
  FPS,
  totalDurationInFrames,
} from "./QuranVideo/QuranComposition";
import { quranPropsSchema, QuranProps } from "./QuranVideo/schema";
import { StoryVideo, STORY_FPS, storyDurationInFrames } from "./QuranVideo/StoryVideo";
import { storyPropsSchema, StoryProps } from "./QuranVideo/storySchema";
import { Cover } from "./QuranVideo/Cover";
import sampleData from "./data/sample-al-ikhlas.json";
import sampleStory from "./data/sample-story.json";

const defaultProps = sampleData as unknown as QuranProps;
const defaultStoryProps = sampleStory as unknown as StoryProps;

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

      {/* Hifz (memorization) preview — same engine, mode flipped on */}
      <Composition
        id="QuranHifz"
        component={QuranComposition}
        schema={quranPropsSchema}
        defaultProps={{ ...defaultProps, mode: "hifz", hifzRepeats: 4 }}
        fps={FPS}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(1, totalDurationInFrames(props)),
        })}
      />

      {/* Tajweed preview (needs fetched runs to show colour; plain text otherwise) */}
      <Composition
        id="QuranTajweed"
        component={QuranComposition}
        schema={quranPropsSchema}
        defaultProps={{ ...defaultProps, mode: "tajweed" }}
        fps={FPS}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => ({
          durationInFrames: Math.max(1, totalDurationInFrames(props)),
        })}
      />

      {/* AI-narrated story video (vertical) — narration + real ayahs */}
      <Composition
        id="StoryVideo"
        component={StoryVideo}
        schema={storyPropsSchema}
        defaultProps={defaultStoryProps}
        fps={STORY_FPS}
        width={1080}
        height={1920}
        calculateMetadata={({ props }) => ({
          durationInFrames: storyDurationInFrames(props),
        })}
      />

      {/* Static branded cover for the feed (rendered as a still) */}
      <Composition
        id="CoverCard"
        component={Cover}
        defaultProps={{
          title: "Two Seas\nThat Never Mix",
          kicker: "QUR'AN & SCIENCE",
          image: "https://images.pexels.com/photos/6388945/pexels-photo-6388945.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1080&h=1920",
          wordmark: "KETABI STUDIO",
        }}
        fps={30}
        durationInFrames={1}
        width={1080}
        height={1920}
      />
    </>
  );
};
