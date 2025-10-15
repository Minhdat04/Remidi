import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.remidi.app',
  appName: 'REMIDI',
  webDir: 'out',
  server: {
    url: 'http://103.200.20.174', // Your VPS IP
    cleartext: true
  }
};

export default config;
