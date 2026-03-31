import { View, Text, StyleSheet } from "react-native";
import Card from "@/src/components/common/Card";
import { COLORS } from "@/src/constants/colors";
import { formatDuration } from "@/src/utils/format";
import type { StationCandidate } from "@/src/types/station";

/**
 * 중간역 후보 카드
 * 1. 역 이름, 양쪽 소요시간 표시
 * 2. 선택 상태 시 강조 스타일
 * 3. 소요시간 차이가 적을수록 좋은 후보임을 시각적으로 표현
 */

interface StationCardProps {
  station: StationCandidate;
  selected: boolean;
  onPress: () => void;
}

export default function StationCard({
  station,
  selected,
  onPress,
}: StationCardProps) {
  const timeDiff = Math.abs(
    station.travelTimeFromA - station.travelTimeFromB
  );

  return (
    <Card onPress={onPress} selected={selected} style={styles.card}>
      {/* 1. 역 이름 */}
      <Text style={styles.stationName}>{station.stationName}</Text>

      {/* 2. 양쪽 소요시간 */}
      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>A에서</Text>
          <Text style={styles.timeValue}>
            {formatDuration(station.travelTimeFromA)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>B에서</Text>
          <Text style={styles.timeValue}>
            {formatDuration(station.travelTimeFromB)}
          </Text>
        </View>
      </View>

      {/* 3. 소요시간 차이 표시 */}
      <Text style={styles.diffText}>
        {timeDiff === 0
          ? "소요시간 동일"
          : `차이 ${formatDuration(timeDiff)}`}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeItem: {
    flex: 1,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primaryLight,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.borderLight,
  },
  diffText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: 10,
  },
});
