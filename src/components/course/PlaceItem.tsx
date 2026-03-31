import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { COLORS } from "@/src/constants/colors";
import { formatDuration, formatCost } from "@/src/utils/format";
import { getPlacePhotoUrl } from "@/src/api/course";
import type { CoursePlace } from "@/src/types/course";

/**
 * 코스 내 개별 장소 아이템
 * 1. 장소 이미지: photoReference 기반 Google Places 이미지 (장소 위에 표시)
 * 2. 타임라인 도트: 첫 번째 = 코랄 채움, 나머지 = 빈 원
 * 3. 도보 커넥터: 장소 사이 이동 시간 표시
 * 4. 카테고리/비용 뱃지
 * 5. 지도 아이콘 버튼
 */

interface PlaceItemProps {
  place: CoursePlace;
  isFirst?: boolean;
  isLast: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  CAFE: "카페",
  RESTAURANT: "식사",
  ACTIVITY: "활동",
  BAR: "바",
  PARK: "산책",
  CULTURE: "문화",
  SHOPPING: "쇼핑",
  ETC: "기타",
};

const TRAVEL_METHOD_LABELS: Record<string, string> = {
  WALK: "도보",
  BUS: "버스",
  SUBWAY: "지하철",
  CAR: "자동차",
};

export default function PlaceItem({
  place,
  isFirst = false,
  isLast,
}: PlaceItemProps) {
  const photoUrl = getPlacePhotoUrl(place.photoReference);

  const handleMapPress = async () => {
    // 네이버 지도 또는 카카오맵으로 장소 열기
    const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(place.placeName)}?c=${place.longitude},${place.latitude},15,0,0,0,dh`;
    await WebBrowser.openBrowserAsync(naverMapUrl);
  };

  const categoryLabel = CATEGORY_LABELS[place.category] || place.category;
  const costLabel =
    place.costMin > 0
      ? place.costMax > place.costMin
        ? `${formatCost(place.costMin)}~${formatCost(place.costMax)}`
        : formatCost(place.costMin)
      : "무료";

  return (
    <View>
      {/* 1. 장소 카드 */}
      <View style={styles.container}>
        {/* 타임라인 도트 + 세로 라인 */}
        <View style={styles.timeline}>
          <View
            style={[
              styles.dot,
              isFirst ? styles.dotFilled : styles.dotOutline,
            ]}
          />
          {!isLast && <View style={styles.line} />}
        </View>

        {/* 장소 정보 */}
        <View style={styles.content}>
          {/* 시간 */}
          {place.startTime && (
            <Text style={styles.time}>{place.startTime}</Text>
          )}

          {/* 장소 이미지 — photoReference 있을 때 표시 */}
          {photoUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: photoUrl }}
                style={styles.placeImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* 장소명 */}
          <Text style={styles.name}>{place.placeName}</Text>

          {/* 추천 이유 / 메모 */}
          {place.memo && (
            <Text style={styles.description}>{place.memo}</Text>
          )}

          {/* 카테고리 + 비용 + 체류시간 뱃지 */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{categoryLabel}</Text>
            </View>
            <View style={styles.costBadge}>
              <Text style={styles.costText}>{costLabel}</Text>
            </View>
            {place.durationMinutes > 0 && (
              <View style={styles.costBadge}>
                <Text style={styles.costText}>
                  {formatDuration(place.durationMinutes)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 지도 아이콘 */}
        <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
          <Text style={styles.mapIcon}>{"\uD83D\uDCCD"}</Text>
        </TouchableOpacity>
      </View>

      {/* 2. 다음 장소까지 이동정보 커넥터 */}
      {!isLast && place.travelMethodToNext && (
        <View style={styles.travelConnector}>
          <View style={styles.travelLine} />
          <Text style={styles.travelText}>
            {TRAVEL_METHOD_LABELS[place.travelMethodToNext] || "이동"}{" "}
            {place.travelTimeToNext
              ? formatDuration(place.travelTimeToNext)
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
    gap: 10,
    marginBottom: 4,
  },
  timeline: {
    width: 24,
    alignItems: "center",
    paddingTop: 4,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  dotFilled: {
    backgroundColor: COLORS.primary,
  },
  dotOutline: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  line: {
    flex: 1,
    width: 1,
    backgroundColor: COLORS.border,
    marginTop: 4,
    minHeight: 30,
  },
  content: {
    flex: 1,
    paddingBottom: 12,
  },
  time: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  // 장소 이미지
  imageContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  placeImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  description: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginBottom: 5,
    lineHeight: 16,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.primary,
  },
  costBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
  },
  costText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  mapButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  mapIcon: {
    fontSize: 14,
  },
  travelConnector: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 11,
    gap: 8,
    marginBottom: 4,
    marginTop: -6,
  },
  travelLine: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.border,
  },
  travelText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
