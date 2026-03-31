import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useCourseStore } from "@/src/stores/useCourseStore";

/**
 * 홈 화면 — 데이트길 메인
 * 1. 코랄 하트 로고 + 환영 메시지
 * 2. 코스 생성 시작 CTA
 * 3. 코랄 테마 적용
 */

export default function HomeScreen() {
  const { nickname } = useAuthStore();
  const { reset } = useCourseStore();
  const router = useRouter();

  const handleStartCourse = () => {
    reset();
    router.push("/course/origin");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 헤더 + 브랜딩 */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoSmall}>
            <Text style={styles.logoHeart}>{"\u2764"}</Text>
          </View>
          <Text style={styles.brandName}>데이트길</Text>
        </View>
        <Text style={styles.greeting}>
          {nickname ? `${nickname}님,` : "안녕하세요,"}
        </Text>
        <Text style={styles.title}>오늘은 어디로 갈까요?</Text>
      </View>

      {/* 2. 코스 생성 CTA */}
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
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  logoSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoHeart: {
    fontSize: 14,
    color: COLORS.textInverse,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
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
