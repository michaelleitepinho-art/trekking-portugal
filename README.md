# 🥾 Trekking Portugal — App

App de planeamento de trekking, hiking, alpinismo, escalada e trail running em Portugal.

## Funcionalidades
- ✅ Ecrã inicial com seleção de desporto (5 modalidades)
- ✅ Lista de trilhos com filtros por desporto, dificuldade e região
- ✅ Dados reais AllTrails (ratings, fotos, distância, desnível)
- ✅ Meteorologia via OpenWeatherMap (com a tua API key)
- ✅ Alertas e estado do trilho por km
- ✅ Equipamento adaptado por modalidade com checklist
- ✅ Pontos de interesse (água, comida, abrigo, vistas)
- ✅ Favoritos
- ✅ Perfil e configurações

---

## 🚀 Como correr

### 1. Instalar dependências
```bash
npm install
```

### 2. Correr no telemóvel (Expo Go)
```bash
npx expo start
```
Lê o QR code com a app **Expo Go** (Android / iOS).

### 3. Correr em emulador Android
```bash
npx expo start --android
```

---

## 📦 Compilar APK real

### Pré-requisitos
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### APK de teste (rápido)
```bash
npm run build:apk
```
→ Gera um `.apk` para instalar diretamente no Android.

### App Bundle para Google Play
```bash
npm run build:android
```

---

## 🌤️ Integrar OpenWeatherMap

1. Cria conta gratuita em https://openweathermap.org
2. Vai a **API Keys** e copia a tua key
3. Na app: separador **Perfil → API Key → cola e guarda**
4. Em alternativa, abre `app/result/[id].tsx` e substitui:
   ```
   const OPENWEATHER_KEY = 'YOUR_OPENWEATHERMAP_KEY';
   ```
   pela tua key real e descomenta o bloco `fetchWeather()`.

---

## 🗂️ Estrutura do projeto
```
TrekkingApp/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        ← Ecrã inicial
│   │   ├── explore.tsx      ← Explorar trilhos
│   │   ├── favorites.tsx    ← Favoritos
│   │   └── profile.tsx      ← Perfil + API key
│   ├── result/[id].tsx      ← Resultado + meteo + equipamento
│   └── _layout.tsx
├── constants/
│   └── theme.ts             ← Cores e constantes
├── data/
│   └── trails.ts            ← Dados dos trilhos (AllTrails)
├── app.json                 ← Config Expo
├── eas.json                 ← Config EAS Build (APK)
└── babel.config.js
```

---

## 🔧 Próximos passos
- [ ] Integrar mapa nativo (react-native-maps)
- [ ] Perfil de altimetria com react-native-svg
- [ ] Notificações push de alertas
- [ ] Modo offline com trilhos em cache
- [ ] Plano de horários com timeline interativa
