import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

/**
 * 공용 로딩 컴포넌트
 * 1. 전체 화면 중앙에 코랄 스피너 + 메시지 표시
 * 2. 코스 생성 등 대기 시간이 긴 작업에서 사용
 */

interface LoadingProps {
  message?: string;
}

export default function Loading({ message }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    gap: 16,
  },
  message: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});
