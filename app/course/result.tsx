import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TimelineCard from "@/src/components/course/TimelineCard";
import CourseMapView from "@/src/components/course/CourseMapView";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useCourseStore } from "@/src/stores/useCourseStore";
import { formatCost, formatDuration } from "@/src/utils/format";
import * as courseApi from "@/src/api/course";

/**
 * AI 코스 결과 화면
 * 1. 상단: 지도 뷰 (장소 마커)
 * 2. 코스 탭 (A / B / C) — 백엔드가 1개만 반환하면 탭 1개
 * 3. 요약 바 (총 비용 + 소요시간)
 * 4. 타임라인 카드 (장소 이미지 포함)
 * 5. 공유 + 북마크 액션 버튼
 */

export default function ResultScreen() {
  const { courseResults, selectedStation } = useCourseStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const selectedCourse = courseResults?.[selectedIndex];

  // 지도 중심점 계산: 장소들의 평균 좌표 또는 선택된 역 좌표
  const mapCenter = useMemo(() => {
    if (!selectedCourse || selectedCourse.places.length === 0) {
      return {
        latitude: selectedStation?.latitude || 37.5495,
        longitude: selectedStation?.longitude || 126.9137,
      };
    }
    const places = selectedCourse.places;
    const avgLat =
      places.reduce((sum, p) => sum + p.latitude, 0) / places.length;
    const avgLng =
      places.reduce((sum, p) => sum + p.longitude, 0) / places.length;
    return { latitude: avgLat, longitude: avgLng };
  }, [selectedCourse, selectedStation]);

  // 카카오톡 공유
  const handleShare = async () => {
    if (!selectedCourse) return;
    try {
      const shareResponse = await courseApi.shareCourse(selectedCourse.courseId);
      Alert.alert("공유 링크 생성됨", shareResponse.shareUrl);
    } catch (error) {
      Alert.alert("오류", "공유 링크 생성에 실패했습니다.");
    }
  };

  // 코스 확정
  const handleConfirm = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      await courseApi.confirmCourse(selectedCourse.courseId);
      router.push(`/course/${selectedCourse.courseId}`);
    } catch (error) {
      Alert.alert("오류", "처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 비용 표시: costMin ~ costMax 또는 totalCostMin
  const costDisplay = selectedCourse
    ? selectedCourse.totalCostMax > selectedCourse.totalCostMin
      ? `${formatCost(selectedCourse.totalCostMin)} ~ ${formatCost(selectedCourse.totalCostMax)}`
      : formatCost(selectedCourse.totalCostMin)
    : "";

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI 추천 코스</Text>
      </View>

      {/* 2. 지도 뷰 — 장소 마커 표시 */}
      {selectedCourse && selectedCourse.places.length > 0 && (
        <CourseMapView
          places={selectedCourse.places}
          center={mapCenter}
        />
      )}

      {/* 3. 코스 탭 (A / B / C) */}
      {courseResults && courseResults.length > 1 && (
        <View style={styles.tabRow}>
          {courseResults.map((course, index) => {
            const isActive = selectedIndex === index;
            const label = `코스 ${String.fromCharCode(65 + index)}`;
            return (
              <TouchableOpacity
                key={course.courseId}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setSelectedIndex(index)}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 4. 요약 바 */}
      {selectedCourse && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            총 예상 비용{" "}
            <Text style={styles.summaryBold}>{costDisplay}</Text>
          </Text>
          <Text style={styles.summaryText}>
            소요시간{" "}
            <Text style={styles.summaryBold}>
              약 {formatDuration(selectedCourse.totalDuration)}
            </Text>
          </Text>
        </View>
      )}

      {/* 5. 타임라인 */}
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {selectedCourse && <TimelineCard course={selectedCourse} />}
      </ScrollView>

      {/* 6. 액션 버튼 */}
      <View style={styles.actionRow}>
        <Button
          title="카카오톡 공유"
          onPress={handleShare}
          style={styles.shareButton}
          loading={false}
        />
        <TouchableOpacity style={styles.bookmarkButton}>
          <Text style={styles.bookmarkIcon}>{"\uD83D\uDD16"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
    marginBottom: 6,
  },
  backArrow: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  tabRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
    marginBottom: 14,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textTertiary,
  },
  tabTextActive: {
    color: COLORS.textInverse,
  },
  summaryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
    marginTop: 10,
  },
  summaryText: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  summaryBold: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  scrollArea: {
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    marginTop: 6,
  },
  shareButton: {
    flex: 1,
  },
  bookmarkButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkIcon: {
    fontSize: 18,
  },
});
