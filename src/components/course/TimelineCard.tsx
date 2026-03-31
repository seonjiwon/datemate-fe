import { View, Text, StyleSheet } from "react-native";
import Card from "@/src/components/common/Card";
import PlaceItem from "./PlaceItem";
import { COLORS } from "@/src/constants/colors";
import { formatDuration, formatCost } from "@/src/utils/format";
import type { Course } from "@/src/types/course";

/**
 * 코스 타임라인 카드
 * 1. 코스 전체 요약 (총 시간, 총 비용, 장소 수)
 * 2. 장소별 PlaceItem을 타임라인으로 나열
 * 3. 카드 터치 시 상세 화면 이동 (onPress)
 */

interface TimelineCardProps {
  course: Course;
  onPress?: () => void;
  selected?: boolean;
}

export default function TimelineCard({
  course,
  onPress,
  selected,
}: TimelineCardProps) {
  return (
    <Card onPress={onPress} selected={selected} style={styles.card}>
      {/* 1. 코스 요약 헤더 */}
      <View style={styles.header}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryItem}>
            {formatDuration(course.totalDuration)}
          </Text>
          <View style={styles.dot} />
          <Text style={styles.summaryItem}>
            {formatCost(course.totalEstimatedCost)}
          </Text>
          <View style={styles.dot} />
          <Text style={styles.summaryItem}>
            {course.placeCount}곳
          </Text>
        </View>
      </View>

      {/* 2. 타임라인 장소 목록 */}
      <View style={styles.timeline}>
        {course.places.map((place, index) => (
          <PlaceItem
            key={place.id}
            place={place}
            isLast={index === course.places.length - 1}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  summaryItem: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primaryLight,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  timeline: {
    paddingTop: 4,
  },
});
