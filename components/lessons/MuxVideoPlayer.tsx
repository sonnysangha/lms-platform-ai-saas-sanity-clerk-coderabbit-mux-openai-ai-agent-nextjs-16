"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { VideoOff } from "lucide-react";
import { getMuxSignedToken } from "@/lib/actions";

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
  const [signedToken, setSignedToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!playbackId) {
      setIsLoading(false);
      return;
    }

    async function fetchToken() {
      try {
        const result = await getMuxSignedToken(playbackId as string);
        setSignedToken(result.token);
      } catch {
        // Silently handle errors - token will be null and player may fallback
      } finally {
        setIsLoading(false);
      }
    }

    fetchToken();
  }, [playbackId]);

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

  if (isLoading) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3 animate-pulse" />
          <p className="text-zinc-500">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MuxPlayer
        playbackId={playbackId}
        tokens={signedToken ? { playback: signedToken } : undefined}
        metadata={{
          video_title: title ?? "Lesson video",
        }}
        streamType="on-demand"
        autoPlay={false}
        className="w-full aspect-video rounded-xl overflow-hidden"
        accentColor="#8b5cf6"
        onError={() => {
          // Error handling - player will show its own error UI
        }}
      />
    </div>
  );
}
