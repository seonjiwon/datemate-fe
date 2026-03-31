import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";
import type { CoursePlace } from "@/src/types/course";

/**
 * 코스 지도 뷰 — 웹 전용 Fallback
 * react-native-maps는 네이티브 전용이므로 웹에서는 장소 목록 UI로 대체한다
 */

interface CourseMapViewProps {
  places: CoursePlace[];
  center: { latitude: number; longitude: number };
}

export default function CourseMapView({ places }: CourseMapViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🗺️</Text>
      <Text style={styles.title}>
        {places.length}개 장소
      </Text>
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

const styles = StyleSheet.create({
  container: {
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
  emoji: {
    fontSize: 24,
  },
  title: {
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
