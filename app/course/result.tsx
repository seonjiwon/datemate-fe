import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TimelineCard from "@/src/components/course/TimelineCard";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useCourseStore } from "@/src/stores/useCourseStore";
import * as courseApi from "@/src/api/course";

/**
 * AI 코스 결과 화면
 * 1. 생성된 코스 후보 3~4개를 타임라인 카드로 표시
 * 2. 하나를 선택해서 "이 코스로 갈래요" 버튼으로 실행 처리
 * 3. 카카오톡 공유 버튼
 */

export default function ResultScreen() {
  const { courseResults, selectedStation } = useCourseStore();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. 코스 실행 처리
  const handleExecute = async () => {
    if (!selectedCourseId) {
      Alert.alert("알림", "가고 싶은 코스를 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      // 1-1. 서버에 실행 상태 업데이트
      await courseApi.executeCourse(selectedCourseId);

      // 1-2. 코스 상세 화면으로 이동
      router.push(`/course/${selectedCourseId}`);
    } catch (error) {
      Alert.alert("오류", "처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 2. 카카오톡 공유
  const handleShare = async () => {
    if (!selectedCourseId) {
      Alert.alert("알림", "공유할 코스를 선택해주세요.");
      return;
    }

    try {
      // TODO: 카카오톡 공유 SDK 연동
      const shareResponse = await courseApi.shareCourse(selectedCourseId);
      Alert.alert("공유 링크 생성됨", shareResponse.shareUrl);
    } catch (error) {
      Alert.alert("오류", "공유 링크 생성에 실패했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 헤더 */}
      <Text style={styles.title}>추천 코스</Text>
      <Text style={styles.subtitle}>
        {selectedStation?.stationName} 주변 데이트 코스예요
      </Text>

      {/* 2. 코스 후보 목록 */}
      <FlatList
        data={courseResults}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TimelineCard
            course={item}
            selected={selectedCourseId === item.id}
            onPress={() => setSelectedCourseId(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* 3. 액션 버튼 */}
      <View style={styles.buttons}>
        <Button
          title="카카오톡으로 공유"
          onPress={handleShare}
          variant="outline"
          disabled={!selectedCourseId}
        />
        <Button
          title="이 코스로 갈래요"
          onPress={handleExecute}
          loading={loading}
          disabled={!selectedCourseId}
        />
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 16,
  },
  buttons: {
    gap: 10,
    marginBottom: 8,
  },
});
