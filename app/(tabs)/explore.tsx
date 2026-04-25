import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, DifficultyColors, Sports } from '../../constants/theme';
import { TRAILS, Sport } from '../../data/trails';

const SPORT_LIST = Object.entries(Sports) as [Sport, typeof Sports[keyof typeof Sports]][];
const REGIONS = ['Todos', 'Gerês', 'Serra da Estrela', 'Penha Garcia', 'Montejunto'];

export default function ExploreScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState<Sport | 'all'>('all');
  const [region, setRegion] = useState('Todos');

  const filtered = TRAILS.filter(t => {
    const matchSport = sport === 'all' || t.sport.includes(sport as Sport);
    const matchRegion = region === 'Todos' || t.region.includes(region);
    const matchSearch = search === '' || t.name.toLowerCase().includes(search.toLowerCase()) || t.region.toLowerCase().includes(search.toLowerCase());
    return matchSport && matchRegion && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Text style={styles.sub}>Encontra a tua próxima aventura</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={16} color={Colors.gray[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar trilho ou região…"
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

      {/* Sport filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        <TouchableOpacity
          style={[styles.pill, sport === 'all' && styles.pillActive]}
          onPress={() => setSport('all')}>
          <Text style={[styles.pillText, sport === 'all' && styles.pillTextActive]}>Todos</Text>
        </TouchableOpacity>
        {SPORT_LIST.map(([key, s]) => (
          <TouchableOpacity key={key}
            style={[styles.pill, sport === key && styles.pillActive]}
            onPress={() => setSport(key)}>
            <Text style={styles.pillEmoji}>{s.emoji}</Text>
            <Text style={[styles.pillText, sport === key && styles.pillTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Region filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {REGIONS.map(r => (
          <TouchableOpacity key={r}
            style={[styles.regionPill, region === r && styles.regionPillActive]}
            onPress={() => setRegion(r)}>
            <Text style={[styles.regionText, region === r && styles.regionTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
        <Text style={styles.resultCount}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</Text>
        {filtered.map(trail => {
          const diff = DifficultyColors[trail.difficulty];
          const primarySport = Sports[trail.sport[0]];
          return (
            <TouchableOpacity key={trail.id}
              style={styles.card}
              onPress={() => router.push({
                pathname: '/result/[id]',
                params: { id: trail.id, sport: trail.sport[0], date: new Date().toISOString().split('T')[0] }
              })}
              activeOpacity={0.8}>
              <View style={styles.cardTop}>
                <View style={[styles.iconBox, { backgroundColor: primarySport.bg }]}>
                  <Text style={{ fontSize: 22 }}>{trail.icon}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{trail.name}</Text>
                  <Text style={styles.cardRegion}>{trail.region}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.metaPill}>{trail.km} km</Text>
                    <Text style={styles.metaPill}>+{trail.elevationGain}m</Text>
                    <Text style={styles.metaPill}>{trail.durationMin}–{trail.durationMax}h</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
                    <Text style={[styles.diffText, { color: diff.text }]}>{diff.label}</Text>
                  </View>
                  {trail.rating > 0 && (
                    <Text style={styles.rating}>⭐ {trail.rating}</Text>
                  )}
                </View>
              </View>
              <View style={styles.cardTags}>
                {trail.sport.map(s => (
                  <View key={s} style={[styles.sportTag, { backgroundColor: Sports[s].bg }]}>
                    <Text style={[styles.sportTagText, { color: Sports[s].color }]}>
                      {Sports[s].emoji} {Sports[s].label}
                    </Text>
                  </View>
                ))}
                {trail.tags.slice(0, 2).map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 48 : 16, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '500', color: '#1a1a18' },
  sub: { fontSize: 14, color: Colors.gray[400], marginTop: 2 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7',
    borderRadius: 8, paddingHorizontal: 12, height: 40,
    marginHorizontal: 16, marginBottom: 10, marginTop: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a18' },
  filterScroll: { marginBottom: 6 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    borderWidth: 0.5, borderColor: '#D3D1C7', backgroundColor: '#fff', marginRight: 6,
  },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillEmoji: { fontSize: 13 },
  pillText: { fontSize: 12, fontWeight: '500', color: Colors.gray[600] },
  pillTextActive: { color: '#fff' },
  regionPill: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12,
    borderWidth: 0.5, borderColor: '#D3D1C7', backgroundColor: '#fff', marginRight: 6,
  },
  regionPillActive: { backgroundColor: Colors.background, borderColor: Colors.gray[400] },
  regionText: { fontSize: 12, color: Colors.gray[400] },
  regionTextActive: { color: '#1a1a18', fontWeight: '500' },
  list: { flex: 1 },
  resultCount: { fontSize: 11, color: Colors.gray[400], marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 12, padding: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  iconBox: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '500', color: '#1a1a18' },
  cardRegion: { fontSize: 12, color: Colors.gray[400], marginTop: 1 },
  cardMeta: { flexDirection: 'row', gap: 4, marginTop: 5 },
  metaPill: { fontSize: 11, paddingHorizontal: 7, paddingVertical: 2, backgroundColor: Colors.background, borderRadius: 6, color: Colors.gray[600] },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: '500' },
  rating: { fontSize: 11, color: Colors.gray[400] },
  cardTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 },
  sportTag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  sportTagText: { fontSize: 10, fontWeight: '500' },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: Colors.background },
  tagText: { fontSize: 10, color: Colors.gray[600] },
});
