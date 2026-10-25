import React, { useEffect, useRef } from 'react';

interface YouTubeMusicPlayerProps {
  youtubeUrl: string;
  volume: number; // 0 to 1
  loop: boolean;
  isPlaying: boolean;
  startOffset?: number; // Starting timestamp & loop restart offset in seconds
}

export interface ParsedYouTube {
  videoId: string | null;
  playlistId: string | null;
}

const parseYouTubeUrl = (url: string): ParsedYouTube => {
  if (!url || typeof url !== 'string') return { videoId: null, playlistId: null };

  let videoId: string | null = null;
  let playlistId: string | null = null;

  try {
    const listMatch = url.match(/[?&]list=([^#&?]+)/);
    if (listMatch && listMatch[1]) {
      playlistId = listMatch[1];
    }

    const videoMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (videoMatch && videoMatch[1]) {
      videoId = videoMatch[1];
    }
  } catch {
    // ignore
  }

  return { videoId, playlistId };
};

export const YouTubeMusicPlayer: React.FC<YouTubeMusicPlayerProps> = ({
  youtubeUrl,
  volume,
  loop,
  isPlaying,
  startOffset = 0,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { videoId, playlistId } = parseYouTubeUrl(youtubeUrl);
  const cleanStartOffset = Math.max(0, Math.floor(startOffset || 0));

  // Sync volume, play state, and seek position with the YouTube iframe
  useEffect(() => {
    if (!iframeRef.current || (!videoId && !playlistId)) return;

    try {
      const targetWindow = iframeRef.current.contentWindow;
      if (targetWindow) {
        // Subscribe to iframe events
        targetWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');

        targetWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [Math.round(volume * 100)] }),
          '*'
        );

        if (isPlaying) {
          targetWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
        } else {
          targetWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
        }
      }
    } catch {
      // ignore
    }
  }, [volume, isPlaying, videoId, playlistId]);

  // When startOffset is adjusted or changed, seek to the new offset if playing
  useEffect(() => {
    if (!iframeRef.current || !isPlaying || (!videoId && !playlistId)) return;

    try {
      const targetWindow = iframeRef.current.contentWindow;
      if (targetWindow && cleanStartOffset > 0) {
        targetWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [cleanStartOffset, true] }),
          '*'
        );
      }
    } catch {
      // ignore
    }
  }, [cleanStartOffset, isPlaying, videoId, playlistId]);

  // Listen for YouTube player state changes to handle custom loop offset restart
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) return;
      if (e.source !== iframeRef.current.contentWindow) return;

      try {
        let data = e.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }

        // YouTube player state values:
        // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
        const playerState =
          data?.info?.playerState ??
          (data?.event === 'onStateChange' ? data?.info : undefined);

        if (playerState === 0) {
          // Song reached the end
          if (loop && isPlaying) {
            const targetWindow = iframeRef.current.contentWindow;
            // Loop back to startOffset (skipping silent intro)
            targetWindow.postMessage(
              JSON.stringify({ event: 'command', func: 'seekTo', args: [cleanStartOffset, true] }),
              '*'
            );
            targetWindow.postMessage(
              JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
              '*'
            );
          }
        }
      } catch {
        // ignore non-json messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [loop, isPlaying, cleanStartOffset]);

  if ((!videoId && !playlistId) || !isPlaying) return null;

  let iframeSrc = '';
  const originParam = typeof window !== 'undefined' ? `&origin=${encodeURIComponent(window.location.origin)}` : '';
  const startParam = cleanStartOffset > 0 ? `&start=${cleanStartOffset}` : '';

  if (videoId) {
    // When loop is controlled via JavaScript message events, we don't force native YouTube playlist loop
    // so it properly fires ENDED (state 0) and we seekTo(cleanStartOffset) seamlessly!
    iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&controls=0&disablekb=1&fs=0&modestbranding=1${startParam}${originParam}`;
  } else if (playlistId) {
    iframeSrc = `https://www.youtube.com/embed?listType=playlist&list=${playlistId}&autoplay=1&enablejsapi=1&controls=0&disablekb=1&fs=0&modestbranding=1${startParam}${originParam}`;
  }

  return (
    <div className="fixed -bottom-96 -left-96 w-1 h-1 overflow-hidden opacity-0 pointer-events-none z-0">
      <iframe
        ref={iframeRef}
        width="100"
        height="100"
        src={iframeSrc}
        title="Background YouTube Audio"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
};
