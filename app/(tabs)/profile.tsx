import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Platform, Alert, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sports } from '../../constants/theme';

const SPORT_LIST = Object.entries(Sports);

export default function ProfileScreen() {
  const [favSport, setFavSport] = useState('trekking');
  const [weatherKey, setWeatherKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [keySaved, setKeySaved] = useState(false);

  function saveKey() {
    if (!weatherKey.trim()) {
      Alert.alert('API Key vazia', 'Introduz a tua API key do OpenWeatherMap.');
      return;
    }
    setKeySaved(true);
    Alert.alert('✅ API Key guardada', 'A meteorologia vai agora usar dados reais do OpenWeatherMap.');
  }

  const stats = [
    { val: '3', label: 'Trilhos feitos' },
    { val: '31 km', label: 'Distância total' },
    { val: '1 420m', label: 'Desnível total' },
    { val: '12h', label: 'Tempo em trilho' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🥾</Text>
          </View>
          <Text style={styles.name}>Trilheiro Portugal</Text>
          <Text style={styles.sub}>Braga, Portugal</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.content}>

          {/* OpenWeatherMap */}
          <Text style={styles.sectionLabel}>🌤️ Meteorologia — OpenWeatherMap</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>API Key</Text>
            <Text style={styles.cardDesc}>
              Adiciona a tua API key gratuita para obteres meteorologia real por altitude, hora a hora, para cada trilho.
            </Text>
            <View style={styles.keyRow}>
              <TextInput
                style={styles.keyInput}
                value={weatherKey}
                onChangeText={setWeatherKey}
                placeholder="Cole aqui a tua API key…"
                placeholderTextColor={Colors.gray[400]}
                secureTextEntry={!showKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowKey(!showKey)} style={styles.eyeBtn}>
                <Ionicons name={showKey ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.gray[400]} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.saveBtn, keySaved && styles.saveBtnDone]} onPress={saveKey}>
              <Text style={styles.saveBtnText}>{keySaved ? '✅ API Key ativa' : 'Guardar API Key'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkBtn}
              onPress={() => Alert.alert('OpenWeatherMap', 'Vai a openweathermap.org → Sign Up → API Keys → gera uma key gratuita (plano Free).')}>
              <Ionicons name="open-outline" size={13} color={Colors.primary} />
              <Text style={styles.linkText}>Como obter uma API key gratuita</Text>
            </TouchableOpacity>
          </View>

          {/* Desporto favorito */}
          <Text style={styles.sectionLabel}>🏅 Desporto preferido</Text>
          <View style={styles.card}>
            <View style={styles.sportGrid}>
              {SPORT_LIST.map(([key, s]) => (
                <TouchableOpacity key={key}
                  style={[styles.sportBtn, favSport === key && { backgroundColor: s.bg, borderColor: s.color }]}
                  onPress={() => setFavSport(key)}>
                  <Text style={styles.sportBtnEmoji}>{s.emoji}</Text>
                  <Text style={[styles.sportBtnLabel, favSport === key && { color: s.color, fontWeight: '500' }]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preferências */}
          <Text style={styles.sectionLabel}>⚙️ Preferências</Text>
          <View style={styles.card}>
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Notificações de alertas</Text>
              <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: Colors.primary }} />
            </View>
            <View style={[styles.prefRow, { borderTopWidth: 0.5, borderTopColor: '#E8E8E4' }]}>
              <Text style={styles.prefLabel}>Unidades</Text>
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitBtn, units === 'metric' && styles.unitBtnActive]}
                  onPress={() => setUnits('metric')}>
                  <Text style={[styles.unitText, units === 'metric' && styles.unitTextActive]}>km / m</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitBtn, units === 'imperial' && styles.unitBtnActive]}
                  onPress={() => setUnits('imperial')}>
                  <Text style={[styles.unitText, units === 'imperial' && styles.unitTextActive]}>mi / ft</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sobre */}
          <Text style={styles.sectionLabel}>ℹ️ Sobre a app</Text>
          <View style={styles.card}>
            {[
              { icon: 'trail-sign-outline', label: 'Dados de trilhos', val: 'AllTrails' },
              { icon: 'partly-sunny-outline', label: 'Meteorologia', val: weatherKey ? 'OpenWeatherMap ✅' : 'OpenWeatherMap (sem key)' },
              { icon: 'map-outline', label: 'Mapas', val: 'React Native Maps' },
              { icon: 'code-slash-outline', label: 'Versão', val: '1.0.0' },
            ].map((item, i) => (
              <View key={item.label} style={[styles.aboutRow, i > 0 && { borderTopWidth: 0.5, borderTopColor: '#E8E8E4' }]}>
                <Ionicons name={item.icon as any} size={16} color={Colors.gray[400]} />
                <Text style={styles.aboutLabel}>{item.label}</Text>
                <Text style={styles.aboutVal}>{item.val}</Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', paddingTop: Platform.OS === 'android' ? 48 : 20, paddingBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 34 },
  name: { fontSize: 18, fontWeight: '500', color: '#1a1a18' },
  sub: { fontSize: 13, color: Colors.gray[400], marginTop: 2 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 10, padding: 10, alignItems: 'center' },
  statVal: { fontSize: 14, fontWeight: '500', color: '#1a1a18' },
  statLbl: { fontSize: 10, color: Colors.gray[400], marginTop: 2, textAlign: 'center' },
  content: { paddingHorizontal: 16, paddingTop: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '500', color: Colors.gray[400], letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8, marginTop: 16 },
  card: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 12, padding: 14 },
  cardTitle: { fontSize: 14, fontWeight: '500', color: '#1a1a18', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: Colors.gray[400], lineHeight: 18, marginBottom: 12 },
  keyRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 8, paddingLeft: 12, marginBottom: 10 },
  keyInput: { flex: 1, height: 40, fontSize: 13, color: '#1a1a18' },
  eyeBtn: { padding: 10 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginBottom: 8 },
  saveBtnDone: { backgroundColor: Colors.success },
  saveBtnText: { fontSize: 14, fontWeight: '500', color: '#fff' },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { fontSize: 12, color: Colors.primary },
  sportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 0.5, borderColor: '#D3D1C7', borderRadius: 10, backgroundColor: Colors.background },
  sportBtnEmoji: { fontSize: 14 },
  sportBtnLabel: { fontSize: 12, color: Colors.gray[600] },
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  prefLabel: { fontSize: 13, color: '#1a1a18' },
  unitToggle: { flexDirection: 'row', backgroundColor: Colors.background, borderRadius: 8, padding: 2 },
  unitBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  unitBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  unitText: { fontSize: 12, color: Colors.gray[400] },
  unitTextActive: { color: '#1a1a18', fontWeight: '500' },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9 },
  aboutLabel: { flex: 1, fontSize: 13, color: '#1a1a18' },
  aboutVal: { fontSize: 12, color: Colors.gray[400] },
});
