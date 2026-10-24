import { useState, useEffect, useCallback, useRef } from 'react';

export const useBlowDetection = (onBlow: () => void, enabled: boolean) => {
  const [permissionError, setPermissionError] = useState<boolean>(
    () => typeof navigator !== 'undefined' && !navigator?.mediaDevices?.getUserMedia
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopDetection();
      return;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      return;
    }

    let isSubscribed = true;

    const startDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isSubscribed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) {
          setPermissionError(true);
          return;
        }

        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let blowCount = 0;

        const checkBlow = () => {
          if (!isSubscribed) return;
          analyser.getByteFrequencyData(dataArray);
          // Average energy in low-mid frequencies
          let sum = 0;
          const count = Math.floor(dataArray.length / 2);
          for (let i = 0; i < count; i++) {
            sum += dataArray[i];
          }
          const average = sum / (count || 1);

          if (average > 75) {
            blowCount++;
            if (blowCount > 10) {
              // Stable blow detection (~200ms)
              onBlow();
              stopDetection();
              return;
            }
          } else {
            blowCount = 0;
          }
          animationFrameRef.current = requestAnimationFrame(checkBlow);
        };

        checkBlow();
      } catch {
        // Handled gracefully: microphone access was declined or is unsupported in this environment/iframe
        if (isSubscribed) {
          setPermissionError(true);
        }
      }
    };

    startDetection();

    return () => {
      isSubscribed = false;
      stopDetection();
    };
  }, [enabled, onBlow, stopDetection]);

  return { permissionError };
};
