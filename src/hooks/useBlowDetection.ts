import { useState, useEffect, useCallback, useRef } from 'react';

interface BlowDetectionResult {
  permissionError: boolean;
  isListening: boolean;
  micVolume: number;
  enableMic: () => Promise<void>;
}

export const useBlowDetection = (onBlow: () => void, enabled: boolean): BlowDetectionResult => {
  const [permissionError, setPermissionError] = useState<boolean>(false);
  const [isListening, setIsListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isBlowingRef = useRef(false);

  const stopDetection = useCallback(() => {
    setIsListening(false);
    setMicVolume(0);
    isBlowingRef.current = false;

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

  const startDetection = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setPermissionError(true);
      return;
    }

    try {
      // Use standard audio request parameters compatible with mobile & desktop browsers
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
        },
      });

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
        await audioCtx.resume().catch(() => {});
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.2; // Fast reaction time for air puffs
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const freqArray = new Uint8Array(analyser.frequencyBinCount);
      const timeArray = new Uint8Array(analyser.fftSize);

      let blowCount = 0;
      let frameCount = 0;
      let baselineEnergy = 0;

      setIsListening(true);
      setPermissionError(false);

      const checkBlow = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;

        // Auto-resume AudioContext if browser suspended it
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(() => {});
        }

        analyser.getByteFrequencyData(freqArray);
        analyser.getByteTimeDomainData(timeArray);

        // 1. Calculate low-frequency wind turbulence (bins 0 to 10: ~20Hz to ~850Hz)
        let sumLow = 0;
        const lowBins = 12;
        for (let i = 0; i < lowBins; i++) {
          sumLow += freqArray[i];
        }
        const lowEnergy = sumLow / lowBins;

        // 2. Calculate RMS amplitude for wind puff spikes
        let sumSquare = 0;
        for (let i = 0; i < timeArray.length; i++) {
          const norm = (timeArray[i] - 128) / 128;
          sumSquare += norm * norm;
        }
        const rmsVolume = Math.sqrt(sumSquare / timeArray.length) * 100;

        // Combined audio level indicator (0-100 scale)
        const combinedLevel = Math.min(100, Math.round(Math.max(lowEnergy, rmsVolume * 2.2)));
        setMicVolume(combinedLevel);

        // Calibration phase: measure initial background noise floor in first 15 frames
        if (frameCount < 15) {
          baselineEnergy = (baselineEnergy * frameCount + combinedLevel) / (frameCount + 1);
          frameCount++;
        } else {
          // Dynamic blow threshold: must exceed ambient baseline + 12 OR reach minimum 16
          const blowThreshold = Math.max(16, baselineEnergy + 12);

          if (combinedLevel > blowThreshold && !isBlowingRef.current) {
            blowCount++;
            if (blowCount >= 2) {
              // Trigger blow action!
              isBlowingRef.current = true;
              onBlow();
              stopDetection();
              return;
            }
          } else {
            blowCount = Math.max(0, blowCount - 1);
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err) {
      console.warn('Microphone access issue:', err);
      setPermissionError(true);
      setIsListening(false);
    }
  }, [onBlow, stopDetection]);

  // Global click & touch listener to request mic and resume AudioContext if suspended
  useEffect(() => {
    const handleGesture = () => {
      if (!isListening && enabled && !permissionError) {
        startDetection();
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, [enabled, isListening, permissionError, startDetection]);

  useEffect(() => {
    if (enabled) {
      startDetection();
    } else {
      stopDetection();
    }

    return () => {
      stopDetection();
    };
  }, [enabled, startDetection, stopDetection]);

  return {
    permissionError,
    isListening,
    micVolume,
    enableMic: startDetection,
  };
};
