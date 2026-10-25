import React, { useEffect, useRef } from 'react';

interface YouTubeMusicPlayerProps {
  youtubeUrl: string;
  volume: number; // 0 to 1
  loop: boolean;
  isPlaying: boolean;
}

const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const YouTubeMusicPlayer: React.FC<YouTubeMusicPlayerProps> = ({
  youtubeUrl,
  volume,
  loop,
  isPlaying,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoId = extractYouTubeId(youtubeUrl);

  useEffect(() => {
    if (!iframeRef.current || !videoId) return;

    // Send volume message to YouTube iframe API if JS API is enabled
    try {
      const targetWindow = iframeRef.current.contentWindow;
      if (targetWindow) {
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
      // ignore iframe cross-origin postMessage errors
    }
  }, [volume, isPlaying, videoId]);

  if (!videoId || !isPlaying) return null;

  const loopParam = loop ? `&loop=1&playlist=${videoId}` : '&loop=0';
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&controls=0&disablekb=1&fs=0&modestbranding=1${loopParam}`;

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
