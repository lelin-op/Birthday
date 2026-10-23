import { useState, useEffect, useCallback, useRef } from 'react';

export const useBlowDetection = (onBlow: () => void, enabled: boolean) => {
  const [permissionError, setPermissionError] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopDetection = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopDetection();
      return;
    }

    const startDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let blowCount = 0;

        const checkBlow = () => {
          analyser.getByteFrequencyData(dataArray);
          // Average energy in low-mid frequencies
          let sum = 0;
          for (let i = 0; i < dataArray.length / 2; i++) {
            sum += dataArray[i];
          }
          const average = sum / (dataArray.length / 2);

          if (average > 75) {
            blowCount++;
            if (blowCount > 10) { // Stable blow detection (~200ms)
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
      } catch (err) {
        console.error('Mic access denied:', err);
        setPermissionError(true);
      }
    };

    startDetection();
    return stopDetection;
  }, [enabled, onBlow, stopDetection]);

  return { permissionError };
};
