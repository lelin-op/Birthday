import { useState, useEffect, useCallback, useRef } from 'react';

export const useBlowDetection = (onBlow: () => void, enabled: boolean) => {
  const [permissionError, setPermissionError] = useState<boolean>(
    () => typeof navigator !== 'undefined' && !navigator?.mediaDevices?.getUserMedia
  );
  const [isListening, setIsListening] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopDetection = useCallback(() => {
    setIsListening(false);
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

  // Ensure AudioContext is resumed upon user tap/interaction (required by mobile browsers)
  useEffect(() => {
    const resumeAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
    };

    window.addEventListener('click', resumeAudio);
    window.addEventListener('touchstart', resumeAudio);
    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopDetection();
      return;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      setPermissionError(true);
      return;
    }

    let isSubscribed = true;

    const startDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true,
          },
        });

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

        if (audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.2; // Fast response to air puffs
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let blowCount = 0;
        setIsListening(true);

        const checkBlow = () => {
          if (!isSubscribed) return;

          // Auto-resume if suspended by browser policy
          if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
          }

          analyser.getByteFrequencyData(dataArray);

          // Focus on low-frequency wind turbulence (bins 1 to 20: ~80Hz - 400Hz)
          let sum = 0;
          const lowBins = 16;
          for (let i = 1; i <= lowBins; i++) {
            sum += dataArray[i];
          }
          const lowEnergy = sum / lowBins;

          // Responsive threshold for mic blow (wind noise triggers strong low-frequency energy > 35)
          if (lowEnergy > 35) {
            blowCount++;
            if (blowCount >= 4) { // Fast response (~120ms)
              onBlow();
              stopDetection();
              return;
            }
          } else {
            blowCount = Math.max(0, blowCount - 1);
          }

          animationFrameRef.current = requestAnimationFrame(checkBlow);
        };

        checkBlow();
      } catch {
        if (isSubscribed) {
          setPermissionError(true);
          setIsListening(false);
        }
      }
    };

    startDetection();

    return () => {
      isSubscribed = false;
      stopDetection();
    };
  }, [enabled, onBlow, stopDetection]);

  return { permissionError, isListening };
};
