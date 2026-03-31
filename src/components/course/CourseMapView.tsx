import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { COLORS } from "@/src/constants/colors";
import type { CoursePlace } from "@/src/types/course";

/**
 * 코스 지도 뷰 — 네이티브 전용 (iOS/Android)
 * 1. react-native-maps MapView로 장소 마커를 표시한다
 * 2. New Architecture(ReactFabric) 환경에서 MapView 렌더링 실패 시
 *    ErrorBoundary가 잡아서 장소 목록 fallback UI를 표시한다
 * 3. iOS: Apple Maps (API 키 불필요), Android: Google Maps
 *
 * 웹에서는 CourseMapView.web.tsx가 대신 로드된다
 */

// -- lazy import: MapView가 로드 자체에서 터질 수 있으므로 try/catch --
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
let mapAvailable = false;

try {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
  Polyline = maps.Polyline;
  mapAvailable = true;
} catch (e) {
  console.warn("[CourseMapView] react-native-maps 로드 실패:", e);
}

interface CourseMapViewProps {
  places: CoursePlace[];
  center: { latitude: number; longitude: number };
}

// ── ErrorBoundary: MapView 렌더 시 JSI 에러 등을 잡아준다 ──
interface ErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[CourseMapView] MapView 렌더 에러 → fallback:", error.message);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ── Fallback UI: 지도 대신 장소 칩 목록 ──
function MapFallback({ places }: { places: CoursePlace[] }) {
  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackEmoji}>🗺️</Text>
      <Text style={styles.fallbackTitle}>{places.length}개 장소 코스</Text>
      <View style={styles.placeList}>
        {places.map((place, i) => (
          <View key={i} style={styles.placeChip}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{i + 1}</Text>
            </View>
            <Text style={styles.placeName} numberOfLines={1}>
              {place.placeName}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── 메인 컴포넌트 ──
export default function CourseMapView({ places, center }: CourseMapViewProps) {
  console.log(
    "[CourseMapView] render — mapAvailable:",
    mapAvailable,
    "places:",
    places.length,
    "center:",
    center
  );

  // MapView 로드 자체가 실패한 경우
  if (!mapAvailable || !MapView) {
    return <MapFallback places={places} />;
  }

  // 장소들을 포함하는 영역 계산
  const latitudes = places.map((p) => p.latitude);
  const longitudes = places.map((p) => p.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latDelta = Math.max((maxLat - minLat) * 1.5, 0.008);
  const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.008);

  // NaN 체크 — 좌표가 잘못되면 지도를 그릴 수 없다
  if (
    isNaN(center.latitude) ||
    isNaN(center.longitude) ||
    isNaN(latDelta) ||
    isNaN(lngDelta)
  ) {
    console.warn("[CourseMapView] 좌표가 NaN — fallback 표시");
    return <MapFallback places={places} />;
  }

  const coordinates = places.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  return (
    <MapErrorBoundary fallback={<MapFallback places={places} />}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          {/* 장소 간 경로 라인 */}
          {coordinates.length > 1 && (
            <Polyline
              coordinates={coordinates}
              strokeColor={COLORS.primary}
              strokeWidth={2}
              lineDashPattern={[6, 4]}
            />
          )}

          {/* 장소 마커 */}
          {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.placeName}
              description={place.address}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.markerBubble,
                    index === 0 && styles.markerBubbleFirst,
                  ]}
                >
                  <Text style={styles.markerNumber}>{index + 1}</Text>
                </View>
                <View style={styles.markerArrow} />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    </MapErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 4,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
  },
  markerBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  markerBubbleFirst: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
  },
  markerNumber: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.primary,
    marginTop: -1,
  },
  // ── Fallback 스타일 ──
  fallbackContainer: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  fallbackEmoji: {
    fontSize: 24,
  },
  fallbackTitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: "600",
  },
  placeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 12,
    justifyContent: "center",
    marginTop: 4,
  },
  placeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  numberBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  placeName: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: "500",
    maxWidth: 80,
  },
});
