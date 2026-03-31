import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import PlaceItem from "@/src/components/course/PlaceItem";
import Button from "@/src/components/common/Button";
import Loading from "@/src/components/common/Loading";
import { COLORS } from "@/src/constants/colors";
import { formatDuration, formatCost } from "@/src/utils/format";
import * as courseApi from "@/src/api/course";
import type { Course } from "@/src/types/course";

/**
 * 코스 상세 화면 (공유 링크 진입점)
 * 1. 코스 ID로 상세 데이터 조회
 * 2. 타임라인 형태로 장소 목록 표시
 * 3. 각 장소 터치 시 외부 지도 앱 열기
 */

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      // 1. 코스 상세 데이터 조회
      const courseId = Number(id);
      if (isNaN(courseId)) throw new Error("Invalid course ID");

      const data = await courseApi.getCourseDetail(courseId);
      setCourse(data);
    } catch (error) {
      Alert.alert("오류", "코스 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 2. 카카오톡 공유
  const handleShare = async () => {
    if (!course) return;

    try {
      // TODO: 카카오톡 공유 SDK 연동
      const shareResponse = await courseApi.shareCourse(course.id);
      Alert.alert("공유 링크 생성됨", shareResponse.shareUrl);
    } catch (error) {
      Alert.alert("오류", "공유 링크 생성에 실패했습니다.");
    }
  };

  if (loading || !course) {
    return <Loading message="코스 정보를 불러오는 중..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. 코스 요약 */}
        <View style={styles.summary}>
          <Text style={styles.title}>데이트 코스</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItem}>
              {formatDuration(course.totalDuration)}
            </Text>
            <Text style={styles.summaryDivider}>|</Text>
            <Text style={styles.summaryItem}>
              {formatCost(course.totalEstimatedCost)}
            </Text>
            <Text style={styles.summaryDivider}>|</Text>
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
      </ScrollView>

      {/* 3. 공유 버튼 */}
      <Button
        title="카카오톡으로 공유"
        onPress={handleShare}
        variant="secondary"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },
  summary: {
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryItem: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primaryLight,
  },
  summaryDivider: {
    color: COLORS.border,
  },
  timeline: {
    paddingBottom: 24,
  },
});
