// Web Audio API Lo-Fi Romantic Background Music Engine
// Generates soft, warm, romantic lo-fi birthday melody loops & arpeggios

import type { MusicTrack } from '../types';

class BackgroundMusicEngine {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private volume = 0.35;
  private currentTrack: MusicTrack = 'lofiBirthday';
  private timerId: ReturnType<typeof setInterval> | null = null;
  private currentStep = 0;
  private startOffsetSec = 0;

  // Chord Progressions (Frequencies in Hz for warm romantic vibes)
  // Cmaj7 -> Am7 -> Fmaj7 -> G7 (Lo-fi Birthday)
  private lofiChords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23], // G7
  ];

  // Romantic Piano Chords (Dmaj7 -> Bm7 -> Gmaj7 -> A7)
  private romanticChords = [
    [293.66, 369.99, 440.00, 554.37], // Dmaj7
    [246.94, 293.66, 369.99, 440.00], // Bm7
    [196.00, 246.94, 293.66, 369.99], // Gmaj7
    [220.00, 277.18, 329.63, 392.00], // A7
  ];

  // Acoustic Aura Chords (Gmaj7 -> Em7 -> Cmaj7 -> D7)
  private acousticChords = [
    [196.00, 246.94, 293.66, 369.99], // Gmaj7
    [164.81, 196.00, 246.94, 293.66], // Em7
    [130.81, 164.81, 196.00, 246.94], // Cmaj7
    [146.83, 185.00, 220.00, 261.63], // D7
  ];

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public start(track: MusicTrack = 'lofiBirthday', volume = 0.35, startOffset = 0) {
    this.currentTrack = track;
    this.volume = volume;
    this.startOffsetSec = Math.max(0, startOffset);
    this.currentStep = Math.floor(this.startOffsetSec / 1.2);

    const ctx = this.initContext();
    if (!ctx) return;

    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
    }

    // Play initial note from offset
    this.playStep();

    // Loop steps every 1200ms for relaxed tempo (~50 BPM lo-fi chill)
    this.timerId = setInterval(() => {
      this.playStep();
    }, 1200);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, this.ctx.currentTime + 0.1);
    }
  }

  public setTrack(track: MusicTrack) {
    this.currentTrack = track;
  }

  public setStartOffset(offsetSec: number) {
    this.startOffsetSec = Math.max(0, offsetSec);
    this.currentStep = Math.floor(this.startOffsetSec / 1.2);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playStep() {
    if (!this.ctx || !this.isPlaying || !this.gainNode) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const chords =
      this.currentTrack === 'romanticPiano'
        ? this.romanticChords
        : this.currentTrack === 'acousticAura'
        ? this.acousticChords
        : this.lofiChords;

    const chordIndex = Math.floor(this.currentStep / 4) % chords.length;
    const chord = chords[chordIndex];

    // Pick warm arpeggiated note from current chord
    const noteIndex = this.currentStep % chord.length;
    const freq = chord[noteIndex];

    // Create Sine/Triangle hybrid oscillator for warm Rhodes / acoustic lo-fi key timbre
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = this.currentTrack === 'romanticPiano' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Subtle vinyl/lo-fi warm pitch detune modulation
    osc.detune.setValueAtTime((Math.random() - 0.5) * 6, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    const attack = 0.08;
    const release = 1.1;

    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.18, now + attack);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + release);

    osc.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + release);

    this.currentStep++;
  }
}

export const bgMusic = new BackgroundMusicEngine();
