export default {
  expo: {
    name: "Trekking Portugal-app",
    slug: "trekking-portugal",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1D9E75"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.trekkingportugal.app"
    },
    android: {
      package: "com.trekkingportugal.app",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "INTERNET",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    },
    plugins: [
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Necessário para mostrar trilhos perto de ti."
        }
      ]
    ],
    scheme: "trekkingportugal",
    web: {
      bundler: "metro"
    },

    // AQUI ESTÁ A CHAVE
    prebuild: {
      skip: true
    },

    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "8aa36eb4-1fc6-45b3-9b26-e08a57c003de"
      }
    },
    owner: "mlpinho"
  }
};
