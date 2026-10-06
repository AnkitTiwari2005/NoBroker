import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.nobroker.app',
  appName: 'NoBroker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#1E3A5F',
  },
  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#1E3A5F',
    },
  },
}

export default config
