import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useCourseStore } from "@/src/stores/useCourseStore";

/**
 * 홈 화면
 * 1. 환영 메시지 (닉네임 표시)
 * 2. 코스 생성 시작 버튼
 * 3. 버튼 터치 시 코스 스토어 초기화 후 출발지 입력 화면으로 이동
 */

export default function HomeScreen() {
  const { nickname } = useAuthStore();
  const { reset } = useCourseStore();
  const router = useRouter();

  const handleStartCourse = () => {
    // 1. 이전 플로우 데이터 초기화
    reset();

    // 2. 출발지 입력 화면으로 이동
    router.push("/course/origin");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 환영 메시지 */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {nickname ? `${nickname}님,` : "안녕하세요,"}
        </Text>
        <Text style={styles.title}>오늘은 어디로 갈까요?</Text>
      </View>

      {/* 2. 코스 생성 시작 */}
      <View style={styles.cta}>
        <Text style={styles.ctaDescription}>
          두 사람의 출발지를 입력하면{"\n"}
          AI가 최적의 데이트 코스를 추천해드려요
        </Text>
        <Button
          title="데이트 코스 만들기"
          onPress={handleStartCourse}
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
  header: {
    paddingTop: 20,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  cta: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
  },
  ctaDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
