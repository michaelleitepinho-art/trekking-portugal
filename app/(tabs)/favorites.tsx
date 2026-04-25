import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, DifficultyColors, Sports } from '../../constants/theme';
import { TRAILS } from '../../data/trails';

export default function FavoritesScreen() {
  const router = useRouter();
  const favorites = TRAILS.filter(t => t.favorite);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.sub}>{favorites.length} trilho{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {favorites.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>⭐</Text>
            <Text style={styles.emptyTitle}>Sem favoritos ainda</Text>
            <Text style={styles.emptyText}>Marca trilhos como favoritos para os encontrares aqui rapidamente.</Text>
          </View>
        ) : (
          favorites.map(trail => {
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
                    {trail.park && <Text style={styles.cardPark}>{trail.park}</Text>}
                    <View style={styles.cardMeta}>
                      <Text style={styles.metaPill}>{trail.km} km</Text>
                      <Text style={styles.metaPill}>+{trail.elevationGain}m</Text>
                      {trail.rating > 0 && <Text style={styles.metaPill}>⭐ {trail.rating}</Text>}
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
                      <Text style={[styles.diffText, { color: diff.text }]}>{diff.label}</Text>
                    </View>
                    <Ionicons name="star" size={16} color="#BA7517" />
                  </View>
                </View>
                <View style={styles.featureRow}>
                  {trail.features.slice(0, 3).map(f => (
                    <View key={f} style={styles.featureChip}>
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.goBtn}
                  onPress={() => router.push({
                    pathname: '/result/[id]',
                    params: { id: trail.id, sport: trail.sport[0], date: new Date().toISOString().split('T')[0] }
                  })}>
                  <Text style={styles.goBtnText}>Planear saída →</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 48 : 16, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '500', color: '#1a1a18' },
  sub: { fontSize: 14, color: Colors.gray[400], marginTop: 2 },
  scroll: { flex: 1 },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#1a1a18', marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.gray[400], textAlign: 'center', lineHeight: 20 },
  card: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 12, padding: 12, marginBottom: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  iconBox: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '500', color: '#1a1a18' },
  cardRegion: { fontSize: 12, color: Colors.gray[400], marginTop: 1 },
  cardPark: { fontSize: 11, color: Colors.primary, marginTop: 1 },
  cardMeta: { flexDirection: 'row', gap: 4, marginTop: 5 },
  metaPill: { fontSize: 11, paddingHorizontal: 7, paddingVertical: 2, backgroundColor: Colors.background, borderRadius: 6, color: Colors.gray[600] },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: '500' },
  featureRow: { flexDirection: 'row', gap: 5, marginTop: 8, flexWrap: 'wrap' },
  featureChip: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: Colors.background, borderRadius: 6 },
  featureText: { fontSize: 11, color: Colors.gray[600] },
  goBtn: { marginTop: 10, paddingVertical: 8, backgroundColor: Colors.primaryLight, borderRadius: 8, alignItems: 'center' },
  goBtnText: { fontSize: 13, fontWeight: '500', color: Colors.primary },
});
