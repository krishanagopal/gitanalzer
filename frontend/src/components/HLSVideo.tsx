"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export function HLSVideo({ src, className, style }: { src: string, className?: string, style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls({ autoStartLoad: true, startLevel: -1 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("HLS autoplay failed", e));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari fallback
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.log("Native HLS autoplay failed", e));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      autoPlay
      loop
      muted
      playsInline
    />
  );
}
