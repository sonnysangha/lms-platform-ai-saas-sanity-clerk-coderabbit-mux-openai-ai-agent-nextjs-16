"use client";

import MuxPlayer from "@mux/mux-player-react";
import { VideoOff } from "lucide-react";

interface MuxVideoPlayerProps {
  playbackId: string | null | undefined;
  title?: string;
  className?: string;
}

export function MuxVideoPlayer({
  playbackId,
  title,
  className,
}: MuxVideoPlayerProps) {
  if (!playbackId) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No video available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MuxPlayer
        playbackId={playbackId}
        metadata={{
          video_title: title ?? "Lesson video",
        }}
        streamType="on-demand"
        autoPlay={false}
        className="w-full aspect-video rounded-xl overflow-hidden"
        accentColor="#8b5cf6"
      />
    </div>
  );
}

