import React, { useEffect, useRef } from 'react';

interface YouTubeMusicPlayerProps {
  youtubeUrl: string;
  volume: number; // 0 to 1
  loop: boolean;
  isPlaying: boolean;
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
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { videoId, playlistId } = parseYouTubeUrl(youtubeUrl);

  useEffect(() => {
    if (!iframeRef.current || (!videoId && !playlistId)) return;

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
      // ignore
    }
  }, [volume, isPlaying, videoId, playlistId]);

  if ((!videoId && !playlistId) || !isPlaying) return null;

  let iframeSrc = '';
  if (videoId) {
    const loopParam = loop ? `&loop=1&playlist=${videoId}` : '&loop=0';
    const listParam = playlistId ? `&list=${playlistId}` : '';
    iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&controls=0&disablekb=1&fs=0&modestbranding=1${loopParam}${listParam}`;
  } else if (playlistId) {
    const loopParam = loop ? '&loop=1' : '&loop=0';
    iframeSrc = `https://www.youtube.com/embed?listType=playlist&list=${playlistId}&autoplay=1&enablejsapi=1&controls=0&disablekb=1&fs=0&modestbranding=1${loopParam}`;
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
