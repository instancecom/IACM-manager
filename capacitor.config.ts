import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2c86ecd5dc17498bb3b1024e12a6e5ff',
  appName: 'tuntuntunbkp-01',
  webDir: 'dist',
  server: {
    url: 'https://2c86ecd5-dc17-498b-b3b1-024e12a6e5ff.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f0f0f',
      showSpinner: false
    }
  }
};

export default config;