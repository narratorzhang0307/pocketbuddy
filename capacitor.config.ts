import type { CapacitorConfig } from '@capacitor/cli';

const liveUrl = process.env.POCKET_BUDDY_LIVE_URL?.trim();

const config: CapacitorConfig = {
  // Independent Pocket Buddy package with its own model/cache directory.
  appId: 'art.throughtheglass.pocketbuddy',
  appName: 'Pocket Buddy',
  webDir: 'dist',
  appendUserAgent: ' PocketBuddyMobile/1.0',
  ...(liveUrl ? {
    server: {
      url: liveUrl,
      cleartext: false,
      allowNavigation: ['pocketbuddy.throughtheglass.art'],
    },
  } : {}),
  android: {
    backgroundColor: '#eaeaea',
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'LIGHT',
      hidden: false,
      animation: 'NONE',
    },
  },
};

export default config;
