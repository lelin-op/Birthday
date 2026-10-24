export type AppState = 'COUNTDOWN' | 'CAKE_BLOW' | 'CANDLES_BLOWN' | 'LETTER_SHOW';

export type AppTheme = 'blackPurplePink' | 'roseGold' | 'midnightStar' | 'lavenderDream' | 'candlelight';

export interface AppConfig {
  recipientName: string;
  senderName: string;
  letterTitle: string;
  letterBody: string;
  memories: string[];
  targetDateISO: string;
  photoUrl: string;
  photoCaption: string;
  theme: AppTheme;
  soundEnabled: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
  recipientName: "My Dearest Love",
  senderName: "Forever Yours",
  letterTitle: "A Love Letter For Your Special Day",
  letterBody: "Happy Birthday to the most breathtaking, kind, and inspiring person in my world. Every single day with you is a gift I cherish beyond words. May this year bring you all the endless joy, warmth, and dreams you bring into my life every moment.",
  memories: [
    "The first laugh we shared under the city lights",
    "Our quiet morning coffees and whispered conversations",
    "Every warm adventure and comforting hug along the way",
    "Growing and dreaming together, today and every tomorrow"
  ],
  targetDateISO: "2026-10-26T00:00:00",
  photoUrl: "/src/assets/images/polaroid_romantic_couple_1792835016851.jpg",
  photoCaption: "Our happiest moments together ✨",
  theme: 'blackPurplePink',
  soundEnabled: true,
};
