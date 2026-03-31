import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { COLORS } from "@/src/constants/colors";
import { formatDuration, formatCost } from "@/src/utils/format";
import type { CoursePlace } from "@/src/types/course";

/**
 * 코스 내 개별 장소 아이템
 * 1. 타임라인 형태로 시간/장소명/설명 표시
 * 2. 터치 시 외부 지도 앱 열기
 * 3. 다음 장소까지의 이동정보 표시
 */

interface PlaceItemProps {
  place: CoursePlace;
  isLast: boolean;
}

export default function PlaceItem({ place, isLast }: PlaceItemProps) {
  const handlePress = async () => {
    // 1. 지도 URL이 있으면 외부 브라우저로 열기
    if (place.mapUrl) {
      await WebBrowser.openBrowserAsync(place.mapUrl);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. 타임라인 도트 + 라인 */}
      <View style={styles.timeline}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* 2. 장소 정보 */}
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.time}>{place.startTime}</Text>
        <Text style={styles.name}>{place.placeName}</Text>
        {place.description && (
          <Text style={styles.description}>{place.description}</Text>
        )}
        <View style={styles.meta}>
          <Text style={styles.metaText}>
            {formatDuration(place.stayDuration)}
          </Text>
          {place.estimatedCost > 0 && (
            <Text style={styles.metaText}>
              {formatCost(place.estimatedCost)}
            </Text>
          )}
          {place.rating && (
            <Text style={styles.metaText}>{place.rating}점</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* 3. 다음 장소까지 이동정보 (마지막 장소 제외) */}
      {!isLast && place.travelMethodToNext && (
        <View style={styles.travelInfo}>
          <Text style={styles.travelText}>
            {place.travelMethodToNext === "WALK" && "도보"}
            {place.travelMethodToNext === "BUS" && "버스"}
            {place.travelMethodToNext === "SUBWAY" && "지하철"}
            {place.travelMethodToNext === "CAR" && "자동차"}
            {place.travelTimeToNext
              ? ` ${formatDuration(place.travelTimeToNext)}`
              : ""}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    minHeight: 80,
  },
  timeline: {
    width: 24,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.borderLight,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 24,
  },
  time: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: "600",
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  meta: {
    flexDirection: "row",
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  travelInfo: {
    position: "absolute",
    left: 30,
    bottom: 4,
  },
  travelText: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: "500",
  },
});
