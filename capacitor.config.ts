import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Selene Academia — Capacitor config (Android + iOS wrapper).
 *
 * Strategy: thin web-wrapper. The app loads https://academy.selenaura.com
 * so UX, auth, payments and content stay identical to web. No offline
 * mirror here — users with intermittent connection get the service-worker
 * fallback from the PWA manifest served by the web (when implemented).
 *
 * When Play Store requires signed AAB:
 *   1. Generate keystore: keytool -genkey -v -keystore selene-academia.keystore \
 *        -alias selene -keyalg RSA -keysize 2048 -validity 10000
 *   2. Paste SHA-256 fingerprint into public/.well-known/assetlinks.json
 *   3. Register the Play app with package name com.selenaura.academia
 */
const config: CapacitorConfig = {
  appId: 'com.selenaura.academia',
  appName: 'Selene Academia',
  server: {
    url: 'https://academy.selenaura.com',
    cleartext: false,
  },
  // Para build offline (fallback):
  // webDir: 'out',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#0A0A0F',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A0A0F',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  android: {
    backgroundColor: '#0A0A0F',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    backgroundColor: '#0A0A0F',
    contentInset: 'automatic',
    scheme: 'seleneacademia', // iOS only — Android uses package name (com.selenaura.academia)
  },
};

export default config;
