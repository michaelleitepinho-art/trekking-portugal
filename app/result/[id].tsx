import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator, Platform, Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, DifficultyColors, Sports } from '../../constants/theme';
import { TRAILS, Trail } from '../../data/trails';

const OPENWEATHER_KEY = 'YOUR_OPENWEATHERMAP_KEY'; // substituir pela API key real

interface WeatherData {
  temp: number;
  tempMorn: number;
  description: string;
  icon: string;
  rain: number;
  windSpeed: number;
  humidity: number;
}

function weatherEmoji(desc: string): string {
  if (desc.includes('rain') || desc.includes('chuva')) return '🌧️';
  if (desc.includes('cloud') || desc.includes('nublado')) return '🌥️';
  if (desc.includes('clear') || desc.includes('sol')) return '☀️';
  if (desc.includes('snow')) return '❄️';
  if (desc.includes('storm')) return '⛈️';
  return '🌤️';
}

const EQUIPMENT: Record<string, { name: string; priority: 'ess' | 'rec' | 'spec' }[]> = {
  trekking: [
    { name: 'Saco cama', priority: 'ess' },
    { name: 'Tenda / bivy', priority: 'ess' },
    { name: 'Botas cano alto', priority: 'ess' },
    { name: 'Água 3L+', priority: 'ess' },
    { name: 'Comida 2 dias', priority: 'ess' },
    { name: 'Kit primeiros socorros', priority: 'ess' },
    { name: 'Bastões', priority: 'rec' },
    { name: 'Fogão portátil', priority: 'rec' },
    { name: 'Casaco impermeável', priority: 'spec' },
    { name: 'Bússola + mapa', priority: 'spec' },
  ],
  hiking: [
    { name: 'Botas trekking', priority: 'ess' },
    { name: 'Água 2L', priority: 'ess' },
    { name: 'Kit primeiros socorros', priority: 'ess' },
    { name: 'Bastões', priority: 'rec' },
    { name: 'Powerbank', priority: 'rec' },
    { name: 'Camada extra', priority: 'rec' },
  ],
  alpinismo: [
    { name: 'Crampons', priority: 'spec' },
    { name: 'Piolet', priority: 'spec' },
    { name: 'Arnês + corda', priority: 'spec' },
    { name: 'Capacete', priority: 'ess' },
    { name: 'Óculos glaciar', priority: 'ess' },
    { name: 'Rádio emergência', priority: 'rec' },
  ],
  escalada: [
    { name: 'Arnês', priority: 'spec' },
    { name: 'Corda 60m', priority: 'spec' },
    { name: 'Sapatilhas', priority: 'spec' },
    { name: 'Capacete', priority: 'ess' },
    { name: 'Mosquetões', priority: 'spec' },
    { name: 'Magnésio', priority: 'rec' },
  ],
  trail: [
    { name: 'Sapatilhas trail', priority: 'ess' },
    { name: 'Colete hidratação', priority: 'ess' },
    { name: 'Gel energético', priority: 'ess' },
    { name: 'Corta-vento leve', priority: 'rec' },
    { name: 'Bastões dobráveis', priority: 'rec' },
  ],
};

const prioStyle = {
  ess: { bg: '#EAF3DE', color: '#3B6D11', label: 'Essencial' },
  rec: { bg: '#E6F1FB', color: '#0C447C', label: 'Recomendado' },
  spec: { bg: '#EEEDFE', color: '#3C3489', label: 'Específico' },
};

export default function ResultScreen() {
  const { id, sport, date } = useLocalSearchParams<{ id: string; sport: string; date: string }>();
  const router = useRouter();
  const trail = TRAILS.find(t => t.id === Number(id));
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [activeEquipTab, setActiveEquipTab] = useState<'ess' | 'rec' | 'spec'>('ess');

  useEffect(() => {
    if (!trail) return;
    fetchWeather();
  }, [trail]);

  async function fetchWeather() {
    if (!trail) return;
    setWeatherLoading(true);
    try {
      // Se tens API key real, descomenta e usa:
      // const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${trail.latitude}&lon=${trail.longitude}&exclude=minutely,hourly,alerts&units=metric&lang=pt&appid=${OPENWEATHER_KEY}`;
      // const res = await fetch(url);
      // const data = await res.json();
      // const day = data.daily[1]; // amanhã
      // setWeather({ temp: Math.round(day.temp.day), tempMorn: Math.round(day.temp.morn), description: day.weather[0].description, icon: day.weather[0].main, rain: Math.round((day.pop || 0) * 100), windSpeed: Math.round(day.wind_speed), humidity: day.humidity });

      // Dados simulados enquanto sem API key:
      await new Promise(r => setTimeout(r, 800));
      setWeather({
        temp: trail.elevationMax > 1500 ? 14 : 21,
        tempMorn: trail.elevationMax > 1500 ? 6 : 12,
        description: trail.elevationMax > 1500 ? 'Nublado com períodos de sol' : 'Maioritariamente sol',
        icon: trail.elevationMax > 1500 ? 'Clouds' : 'Clear',
        rain: trail.elevationMax > 1500 ? 35 : 15,
        windSpeed: trail.elevationMax > 1500 ? 28 : 12,
        humidity: 65,
      });
    } catch {
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }

  function toggleItem(name: string) {
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  if (!trail) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: 20, color: Colors.gray[600] }}>Trilho não encontrado.</Text>
      </SafeAreaView>
    );
  }

  const sportKey = (sport || 'trekking') as keyof typeof Sports;
  const sportData = Sports[sportKey];
  const diff = DifficultyColors[trail.difficulty];
  const equipList = EQUIPMENT[sportKey] || EQUIPMENT.hiking;
  const filtered = equipList.filter(e => e.priority === activeEquipTab);
  const checkedCount = equipList.filter(e => checkedItems.has(e.name)).length;
  const progress = Math.round((checkedCount / equipList.length) * 100);

  const dateFormatted = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })
    : 'Hoje';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#1a1a18" />
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>{trail.name}</Text>
        {trail.alltrailsUrl && (
          <TouchableOpacity onPress={() => Linking.openURL(trail.alltrailsUrl!)}>
            <Text style={styles.atLink}>AllTrails ↗</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Header card */}
          <View style={styles.headerCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <View style={[styles.trailIcon, { backgroundColor: sportData.bg }]}>
                <Text style={{ fontSize: 20 }}>{trail.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={[styles.sportTag, { backgroundColor: sportData.bg }]}>
                  <Text style={[styles.sportTagText, { color: sportData.color }]}>{sportData.emoji} {sportData.label}</Text>
                </View>
                <Text style={styles.trailName}>{trail.name}</Text>
                <Text style={styles.trailSub}>{dateFormatted} · {trail.region}</Text>
              </View>
              <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
                <Text style={[styles.diffText, { color: diff.text }]}>{diff.label}</Text>
              </View>
            </View>
            {/* Metrics */}
            <View style={styles.metrics}>
              {[
                { val: `${trail.km} km`, lbl: 'distância' },
                { val: `+${trail.elevationGain}m`, lbl: 'desnível' },
                { val: `${trail.durationMin}–${trail.durationMax}h`, lbl: 'duração' },
                { val: `${trail.rating}★`, lbl: 'avaliação' },
              ].map(m => (
                <View key={m.lbl} style={styles.metric}>
                  <Text style={styles.metricVal}>{m.val}</Text>
                  <Text style={styles.metricLbl}>{m.lbl}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Weather */}
          <Text style={styles.sectionLabel}>Meteorologia</Text>
          <View style={styles.card}>
            {weatherLoading ? (
              <ActivityIndicator color={Colors.primary} style={{ padding: 20 }} />
            ) : weather ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 32 }}>{weatherEmoji(weather.icon)}</Text>
                    <View>
                      <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
                      <Text style={styles.weatherDesc}>{weather.description}</Text>
                    </View>
                  </View>
                  <View style={[styles.weatherBadge,
                    weather.rain > 30 ? { backgroundColor: '#FAEEDA' } : { backgroundColor: '#EAF3DE' }]}>
                    <Text style={[styles.weatherBadgeText,
                      weather.rain > 30 ? { color: '#633806' } : { color: '#27500A' }]}>
                      {weather.rain > 30 ? 'Precaução' : 'Bom tempo'}
                    </Text>
                  </View>
                </View>
                <View style={styles.weatherDetails}>
                  {[
                    { val: `${weather.rain}%`, lbl: 'chuva' },
                    { val: `${weather.tempMorn}°C`, lbl: 'manhã' },
                    { val: `${weather.windSpeed} km/h`, lbl: 'vento' },
                    { val: `${weather.humidity}%`, lbl: 'humidade' },
                  ].map(w => (
                    <View key={w.lbl} style={styles.weatherDetail}>
                      <Text style={styles.weatherDetailVal}>{w.val}</Text>
                      <Text style={styles.weatherDetailLbl}>{w.lbl}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={{ color: Colors.gray[400], fontSize: 13, textAlign: 'center', padding: 12 }}>
                Sem dados meteorológicos. Adiciona a tua API key OpenWeatherMap.
              </Text>
            )}
          </View>

          {/* POIs / Alerts */}
          <Text style={styles.sectionLabel}>Pontos de interesse e alertas</Text>
          <View style={styles.card}>
            {trail.pois.map((poi, i) => {
              const typeConfig = {
                water:     { color: Colors.info,    bg: Colors.infoLight,    emoji: '💧' },
                food:      { color: Colors.success,  bg: Colors.successLight, emoji: '🍽️' },
                shelter:   { color: Colors.purple,   bg: Colors.purpleLight,  emoji: '🛏️' },
                viewpoint: { color: Colors.primary,  bg: Colors.primaryLight, emoji: '📸' },
                alert:     { color: Colors.warning,  bg: Colors.warningLight, emoji: '⚠️' },
                historic:  { color: Colors.purple,   bg: Colors.purpleLight,  emoji: '🏛️' },
              }[poi.type];
              return (
                <View key={i} style={[styles.poiRow, i > 0 && styles.poiRowBorder]}>
                  <View style={[styles.poiIcon, { backgroundColor: typeConfig.bg }]}>
                    <Text style={{ fontSize: 14 }}>{typeConfig.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.poiName}>{poi.name}</Text>
                    <Text style={styles.poiNote}>{poi.note}</Text>
                    {poi.open && <Text style={styles.poiOpen}>Aberto: {poi.open}</Text>}
                  </View>
                  <Text style={styles.poiKm}>km {poi.km}</Text>
                </View>
              );
            })}
          </View>

          {/* Equipment */}
          <Text style={styles.sectionLabel}>Equipamento · {sportData.label}</Text>
          <View style={styles.card}>
            {/* Progress */}
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressLabel}>{checkedCount}/{equipList.length} prontos</Text>
            </View>
            {/* Tabs */}
            <View style={styles.equipTabs}>
              {(['ess', 'rec', 'spec'] as const).map(tab => (
                <TouchableOpacity key={tab}
                  style={[styles.equipTab, activeEquipTab === tab && styles.equipTabActive]}
                  onPress={() => setActiveEquipTab(tab)}>
                  <Text style={[styles.equipTabText, activeEquipTab === tab && styles.equipTabTextActive]}>
                    {prioStyle[tab].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Items */}
            {filtered.map(item => (
              <TouchableOpacity key={item.name} style={styles.equipItem} onPress={() => toggleItem(item.name)}>
                <View style={[styles.checkbox, checkedItems.has(item.name) && styles.checkboxOn]}>
                  {checkedItems.has(item.name) && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                <Text style={[styles.equipName, checkedItems.has(item.name) && styles.equipNameDone]}>
                  {item.name}
                </Text>
                <View style={[styles.prioBadge, { backgroundColor: prioStyle[item.priority].bg }]}>
                  <Text style={[styles.prioText, { color: prioStyle[item.priority].color }]}>
                    {prioStyle[item.priority].label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 44 : 12,
    paddingBottom: 10, backgroundColor: '#fff',
    borderBottomWidth: 0.5, borderBottomColor: '#E8E8E4',
  },
  backBtn: { padding: 4 },
  topTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1a1a18' },
  atLink: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 0 },
  sectionLabel: { fontSize: 11, fontWeight: '500', color: Colors.gray[400], letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8, marginTop: 16 },
  card: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 12, padding: 14 },
  headerCard: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 12, padding: 14 },
  trailIcon: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  sportTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 3 },
  sportTagText: { fontSize: 11, fontWeight: '500' },
  trailName: { fontSize: 14, fontWeight: '500', color: '#1a1a18' },
  trailSub: { fontSize: 12, color: Colors.gray[400], marginTop: 1 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  diffText: { fontSize: 11, fontWeight: '500' },
  metrics: { flexDirection: 'row', gap: 6 },
  metric: { flex: 1, backgroundColor: Colors.background, borderRadius: 8, padding: 8, alignItems: 'center' },
  metricVal: { fontSize: 13, fontWeight: '500', color: '#1a1a18' },
  metricLbl: { fontSize: 10, color: Colors.gray[400], marginTop: 1 },
  weatherTemp: { fontSize: 26, fontWeight: '500', color: '#1a1a18' },
  weatherDesc: { fontSize: 12, color: Colors.gray[400] },
  weatherBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  weatherBadgeText: { fontSize: 12, fontWeight: '500' },
  weatherDetails: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: '#E8E8E4' },
  weatherDetail: { flex: 1, alignItems: 'center' },
  weatherDetailVal: { fontSize: 13, fontWeight: '500', color: '#1a1a18' },
  weatherDetailLbl: { fontSize: 11, color: Colors.gray[400], marginTop: 2 },
  poiRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 9 },
  poiRowBorder: { borderTopWidth: 0.5, borderTopColor: '#E8E8E4' },
  poiIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  poiName: { fontSize: 13, fontWeight: '500', color: '#1a1a18' },
  poiNote: { fontSize: 12, color: Colors.gray[400], marginTop: 1 },
  poiOpen: { fontSize: 11, color: Colors.primary, marginTop: 2 },
  poiKm: { fontSize: 11, color: Colors.gray[400], marginTop: 3 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  progressBar: { flex: 1, height: 5, backgroundColor: Colors.background, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  progressLabel: { fontSize: 11, color: Colors.gray[400] },
  equipTabs: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  equipTab: { flex: 1, paddingVertical: 6, borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 8, alignItems: 'center' },
  equipTabActive: { backgroundColor: Colors.background, borderColor: '#888780' },
  equipTabText: { fontSize: 12, fontWeight: '500', color: Colors.gray[400] },
  equipTabTextActive: { color: '#1a1a18' },
  equipItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 0.5, borderTopColor: '#E8E8E4' },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#D3D1C7', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  checkboxOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  equipName: { flex: 1, fontSize: 13, color: '#1a1a18' },
  equipNameDone: { color: Colors.gray[400], textDecorationLine: 'line-through' },
  prioBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  prioText: { fontSize: 10, fontWeight: '500' },
});
