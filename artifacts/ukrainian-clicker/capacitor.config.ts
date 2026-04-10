import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dissinteractive.ukrainets',
  appName: 'Українець: Шлях До Успіху',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8b4513',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#8b4513'
    }
  }
};

export default config;
