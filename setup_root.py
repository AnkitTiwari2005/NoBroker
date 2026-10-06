import os
import json

base_dir = r"c:\Users\ankit\OneDrive\Desktop\NOBROKER\mobile"
os.makedirs(base_dir, exist_ok=True)

files = {
    "package.json": """{
  "name": "nobroker-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.28",
    "expo-router": "~3.5.23",
    "expo-status-bar": "~1.12.1",
    "expo-font": "~12.0.10",
    "expo-image": "~1.12.15",
    "expo-image-picker": "~15.0.7",
    "expo-splash-screen": "~0.27.5",
    "expo-secure-store": "~13.0.2",
    "expo-haptics": "~13.0.1",
    "expo-linking": "~6.3.1",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "react-native-safe-area-context": "4.10.5",
    "react-native-screens": "~3.31.1",
    "react-native-reanimated": "~3.10.1",
    "react-native-gesture-handler": "~2.16.2",
    "@shopify/flash-list": "1.6.4",
    "@tanstack/react-query": "^5.51.1",
    "zustand": "^4.5.4",
    "axios": "^1.7.2",
    "@gorhom/bottom-sheet": "^4.6.4",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@expo/vector-icons": "^14.0.2",
    "react-native-svg": "15.2.0",
    "react-native-linear-gradient": "^2.8.3",
    "expo-linear-gradient": "~13.0.2"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~18.2.79",
    "typescript": "^5.3.0"
  }
}""",
    "app.json": """{
  "expo": {
    "name": "NoBroker",
    "slug": "nobroker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "nobroker",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1E3A5F"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.nobroker.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1E3A5F"
      },
      "package": "com.nobroker.app",
      "permissions": [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.CAMERA"
      ]
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      [
        "expo-image-picker",
        { "photosPermission": "Allow NoBroker to access your photos to upload property images" }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}""",
    "tsconfig.json": """{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}""",
    "babel.config.js": """module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};""",
    "metro.config.js": """const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);"""
}

for filename, content in files.items():
    filepath = os.path.join(base_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Root setup complete")
