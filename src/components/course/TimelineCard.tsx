import { View, StyleSheet } from "react-native";
import PlaceItem from "./PlaceItem";
import type { Course } from "@/src/types/course";

/**
 * 코스 타임라인 카드
 * 1. 장소별 PlaceItem을 타임라인으로 나열
 * 2. 각 장소는 이미지, 정보, 이동 커넥터 포함
 */

interface TimelineCardProps {
  course: Course;
  onPress?: () => void;
  selected?: boolean;
}

export default function TimelineCard({ course }: TimelineCardProps) {
  return (
    <View style={styles.container}>
      {course.places.map((place, index) => (
        <PlaceItem
          key={index}
          place={place}
          isFirst={index === 0}
          isLast={index === course.places.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
});
