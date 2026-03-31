import { View, Text, StyleSheet } from "react-native";
import Card from "@/src/components/common/Card";
import { COLORS } from "@/src/constants/colors";
import { formatDuration } from "@/src/utils/format";
import type { StationCandidate } from "@/src/types/station";

/**
 * 중간역 후보 카드 — 디자인 시안 반영
 * 1. 선택 시 코랄 보더 + 연한 배경
 * 2. 추천 뱃지 (첫 번째 역)
 * 3. 코랄 도트(나) / 블루 도트(상대방) 소요시간 표시
 */

interface StationCardProps {
  station: StationCandidate;
  selected: boolean;
  onPress: () => void;
  isRecommended?: boolean;
}

export default function StationCard({
  station,
  selected,
  onPress,
  isRecommended = false,
}: StationCardProps) {
  return (
    <Card onPress={onPress} selected={selected} style={styles.card}>
      {/* 1. 역 이름 + 추천 뱃지 */}
      <View style={styles.nameRow}>
        <View style={styles.nameLeft}>
          <View
            style={[
              styles.dot,
              { backgroundColor: selected ? COLORS.primary : "#ccc" },
            ]}
          />
          <Text style={styles.stationName}>{station.stationName}</Text>
        </View>
        {(isRecommended || selected) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>추천</Text>
          </View>
        )}
      </View>

      {/* 2. 양쪽 소요시간 (컬러 도트) */}
      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <View style={[styles.timeDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.timeText}>
            나 {formatDuration(station.travelTimeFromA)}
          </Text>
        </View>
        <View style={styles.timeItem}>
          <View style={[styles.timeDot, { backgroundColor: COLORS.partner }]} />
          <Text style={styles.timeText}>
            상대 {formatDuration(station.travelTimeFromB)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  nameLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  stationName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(244, 63, 94, 0.12)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },
  timeRow: {
    flexDirection: "row",
    gap: 14,
    paddingLeft: 15,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
