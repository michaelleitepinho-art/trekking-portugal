import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Image, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sports, DifficultyColors } from '../../constants/theme';
import { TRAILS, Trail, Sport } from '../../data/trails';

const SPORT_LIST = Object.entries(Sports) as [Sport, typeof Sports[keyof typeof Sports]][];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState<Sport>('trekking');
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filtered = TRAILS.filter(t =>
    t.sport.includes(selectedSport) &&
    (search === '' || t.name.toLowerCase().includes(search.toLowerCase()))
  );

  const sport = Sports[selectedSport];
  const diffColor = selectedTrail ? DifficultyColors[selectedTrail.difficulty] : null;

  const canCalculate = !!selectedTrail;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trekking Portugal</Text>
          <Text style={styles.headerSub}>Que desporto é hoje?</Text>
        </View>

        {/* Sport Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.sportScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {SPORT_LIST.map(([key, s]) => (
            <TouchableOpacity
              key={key}
              style={[styles.sportPill, selectedSport === key && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
              onPress={() => { setSelectedSport(key); setSelectedTrail(null); }}
            >
              <Text style={styles.sportEmoji}>{s.emoji}</Text>
              <Text style={[styles.sportLabel, selectedSport === key && { color: '#fff' }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.content}>

          {/* Search */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={Colors.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Procurar em ${sport.label}…`}
              placeholderTextColor={Colors.gray[400]}
              value={search}
              onChangeText={setSearch}
            />
            {search !== '' && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={Colors.gray[400]} />
              </TouchableOpacity>
            )}
          </View>

          {/* Trail List */}
          <Text style={styles.sectionLabel}>
            {sport.label} · {filtered.length} rotas
          </Text>

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhum trilho encontrado</Text>
            </View>
          ) : (
            filtered.map(trail => {
              const diff = DifficultyColors[trail.difficulty];
              const isSelected = selectedTrail?.id === trail.id;
              return (
                <TouchableOpacity
                  key={trail.id}
                  style={[styles.trailCard, isSelected && styles.trailCardSelected]}
                  onPress={() => setSelectedTrail(isSelected ? null : trail)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.trailIconBox, { backgroundColor: sport.bg }]}>
                    <Text style={styles.trailIconText}>{trail.icon}</Text>
                  </View>
                  <View style={styles.trailInfo}>
                    <Text style={styles.trailName} numberOfLines={1}>{trail.name}</Text>
                    <Text style={styles.trailSub} numberOfLines={1}>{trail.region}</Text>
                    <View style={styles.trailMeta}>
                      <Text style={styles.metaPill}>{trail.km} km</Text>
                      <Text style={styles.metaPill}>+{trail.elevationGain}m</Text>
                      <Text style={styles.metaPill}>{trail.durationMin}–{trail.durationMax}h</Text>
                    </View>
                  </View>
                  <View style={styles.trailRight}>
                    <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
                      <Text style={[styles.diffText, { color: diff.text }]}>{diff.label}</Text>
                    </View>
                    <Text style={[styles.star, trail.favorite && styles.starOn]}>★</Text>
                    {trail.rating > 0 && (
                      <Text style={styles.rating}>⭐ {trail.rating}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {/* Date */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Dia e hora</Text>
          <View style={styles.dateRow}>
            <TextInput
              style={styles.dateInput}
              value={date}
              onChangeText={setDate}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={Colors.gray[400]}
            />
            <TouchableOpacity
              style={styles.todayBtn}
              onPress={() => setDate(new Date().toISOString().split('T')[0])}
            >
              <Text style={styles.todayText}>Hoje</Text>
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.calcBtn, !canCalculate && styles.calcBtnDisabled]}
            disabled={!canCalculate}
            onPress={() => router.push({
              pathname: '/result/[id]',
              params: { id: selectedTrail!.id, sport: selectedSport, date }
            })}
          >
            <Text style={[styles.calcBtnText, !canCalculate && { color: Colors.gray[400] }]}>
              Calcular saída ↗
            </Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 48 : 16, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '500', color: '#1a1a18' },
  headerSub: { fontSize: 14, color: Colors.gray[400], marginTop: 2 },
  sportScroll: { marginBottom: 4 },
  sportPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 0.5, borderColor: '#D3D1C7',
    backgroundColor: '#fff', marginRight: 8,
  },
  sportEmoji: { fontSize: 14 },
  sportLabel: { fontSize: 13, fontWeight: '500', color: Colors.gray[600] },
  content: { paddingHorizontal: 16, paddingTop: 12 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7',
    borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a18' },
  sectionLabel: { fontSize: 11, fontWeight: '500', color: Colors.gray[400], letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 10 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 14, color: Colors.gray[400] },
  trailCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7',
    borderRadius: 12, padding: 12, marginBottom: 8,
  },
  trailCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  trailIconBox: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  trailIconText: { fontSize: 20 },
  trailInfo: { flex: 1, minWidth: 0 },
  trailName: { fontSize: 13, fontWeight: '500', color: '#1a1a18' },
  trailSub: { fontSize: 12, color: Colors.gray[400], marginTop: 1 },
  trailMeta: { flexDirection: 'row', gap: 4, marginTop: 5 },
  metaPill: { fontSize: 11, paddingHorizontal: 7, paddingVertical: 2, backgroundColor: Colors.background, borderRadius: 6, color: Colors.gray[600] },
  trailRight: { alignItems: 'flex-end', gap: 4 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: '500' },
  star: { fontSize: 16, color: '#D3D1C7' },
  starOn: { color: '#BA7517' },
  rating: { fontSize: 11, color: Colors.gray[400] },
  dateRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  dateInput: {
    flex: 1, height: 40, borderWidth: 0.5, borderColor: '#D3D1C7',
    borderRadius: 8, paddingHorizontal: 12, fontSize: 13, backgroundColor: '#fff', color: '#1a1a18',
  },
  todayBtn: {
    height: 40, paddingHorizontal: 14, borderWidth: 0.5, borderColor: '#D3D1C7',
    borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  todayText: { fontSize: 12, fontWeight: '500', color: Colors.gray[600] },
  calcBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
  },
  calcBtnDisabled: { backgroundColor: Colors.gray[50] },
  calcBtnText: { fontSize: 15, fontWeight: '500', color: '#fff' },
});
