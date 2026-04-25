import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Coordinate {
  latitude: number;
  longitude: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const BRAGA_DEFAULT: Coordinate = { latitude: 41.5454, longitude: -8.4265 };
const TRACKING_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 2000,   // ms entre leituras
  distanceInterval: 5,  // metros mínimos entre pontos
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [route, setRoute] = useState<Coordinate[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [followUser, setFollowUser] = useState(true);

  const watcherRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevCoordRef = useRef<Coordinate | null>(null);

  // ── Permissions ─────────────────────────────────────────────────────────────
  useEffect(() => {
    requestPermissions();
    return () => stopTracking();
  }, []);

  async function requestPermissions() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'A app precisa de acesso à localização para mostrar o mapa e fazer tracking do percurso.',
        [{ text: 'OK' }]
      );
      return;
    }
    setPermissionGranted(true);

    // Obtém posição inicial uma vez
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coord: Coordinate = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setCurrentLocation(coord);
      centerMap(coord);
    } catch {
      setCurrentLocation(BRAGA_DEFAULT);
    }
  }

  // ── Map centering ────────────────────────────────────────────────────────────
  function centerMap(coord: Coordinate) {
    mapRef.current?.animateToRegion(
      {
        ...coord,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      600
    );
  }

  // ── Haversine distance (metros) ──────────────────────────────────────────────
  function haversine(a: Coordinate, b: Coordinate): number {
    const R = 6371000;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const sin2Lat = Math.sin(dLat / 2) ** 2;
    const sin2Lon = Math.sin(dLon / 2) ** 2;
    const aa =
      sin2Lat +
      Math.cos(toRad(a.latitude)) *
        Math.cos(toRad(b.latitude)) *
        sin2Lon;
    return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  }

  // ── Start tracking ───────────────────────────────────────────────────────────
  async function startTracking() {
    if (!permissionGranted) {
      await requestPermissions();
      return;
    }

    // Reset estado
    setRoute([]);
    setElapsedSeconds(0);
    setDistanceMeters(0);
    prevCoordRef.current = null;

    setIsTracking(true);
    setFollowUser(true);

    // Timer
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);

    // Watcher de posição
    watcherRef.current = await Location.watchPositionAsync(
      TRACKING_OPTIONS,
      (loc) => {
        const coord: Coordinate = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };

        setCurrentLocation(coord);

        setRoute(prev => {
          // Evita duplicados exatos
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            if (
              last.latitude === coord.latitude &&
              last.longitude === coord.longitude
            ) return prev;
          }
          return [...prev, coord];
        });

        // Calcula distância acumulada
        if (prevCoordRef.current) {
          const d = haversine(prevCoordRef.current, coord);
          setDistanceMeters(prev => prev + d);
        }
        prevCoordRef.current = coord;

        // Segue o utilizador no mapa
        if (followUser) centerMap(coord);
      }
    );
  }

  // ── Stop tracking ────────────────────────────────────────────────────────────
  function stopTracking() {
    watcherRef.current?.remove();
    watcherRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTracking(false);
  }

  function handleToggleTracking() {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  }

  // ── Formatters ───────────────────────────────────────────────────────────────
  function formatTime(secs: number): string {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatDistance(meters: number): string {
    if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
    return `${Math.round(meters)} m`;
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  const initialRegion = {
    ...(currentLocation ?? BRAGA_DEFAULT),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Mapa ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={permissionGranted}
        followsUserLocation={isTracking && followUser}
        showsMyLocationButton={false}
        showsCompass
        showsScale
        onPanDrag={() => setFollowUser(false)}
      >
        {/* Ponto de partida */}
        {route.length > 0 && (
          <Marker coordinate={route[0]} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.startMarker}>
              <Text style={styles.startMarkerText}>▶</Text>
            </View>
          </Marker>
        )}

        {/* Percurso */}
        {route.length > 1 && (
          <Polyline
            coordinates={route}
            strokeColor="#1D9E75"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      {/* ── Stats bar ── */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>{formatDistance(distanceMeters)}</Text>
          <Text style={styles.statLbl}>distância</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>{formatTime(elapsedSeconds)}</Text>
          <Text style={styles.statLbl}>tempo</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>{route.length}</Text>
          <Text style={styles.statLbl}>pontos</Text>
        </View>
      </View>

      {/* ── Botões flutuantes ── */}

      {/* Centrar no utilizador */}
      <TouchableOpacity
        style={styles.btnFloat}
        onPress={() => {
          setFollowUser(true);
          if (currentLocation) centerMap(currentLocation);
        }}
      >
        <Ionicons
          name={followUser ? 'navigate' : 'navigate-outline'}
          size={22}
          color={followUser ? '#1D9E75' : '#5F5E5A'}
        />
      </TouchableOpacity>

      {/* Start / Stop */}
      <TouchableOpacity
        style={[
          styles.btnMain,
          isTracking ? styles.btnStop : styles.btnStart,
        ]}
        onPress={handleToggleTracking}
        activeOpacity={0.85}
      >
        <Ionicons
          name={isTracking ? 'stop' : 'play'}
          size={24}
          color="#fff"
        />
        <Text style={styles.btnMainText}>
          {isTracking ? 'Parar percurso' : 'Iniciar percurso'}
        </Text>
      </TouchableOpacity>

      {/* Badge de tracking ativo */}
      {isTracking && (
        <View style={styles.trackingBadge}>
          <View style={styles.trackingDot} />
          <Text style={styles.trackingText}>A gravar percurso</Text>
        </View>
      )}

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    flex: 1,
  },

  // Stats
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 0.5,
    borderTopColor: '#E8E8E4',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1a1a18',
  },
  statLbl: {
    fontSize: 11,
    color: '#888780',
    marginTop: 2,
  },
  statDivider: {
    width: 0.5,
    height: 32,
    backgroundColor: '#E8E8E4',
  },

  // Botão flutuante (centrar)
  btnFloat: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 56 : 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  // Botão principal
  btnMain: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btnStart: {
    backgroundColor: '#1D9E75',
  },
  btnStop: {
    backgroundColor: '#E24B4A',
  },
  btnMainText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },

  // Badge gravação
  trackingBadge: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 56 : 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E24B4A',
  },
  trackingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a18',
  },

  // Marcador de partida
  startMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1D9E75',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startMarkerText: {
    fontSize: 10,
    color: '#fff',
  },
});
