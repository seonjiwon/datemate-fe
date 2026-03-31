import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useAuthStore } from "@/src/stores/useAuthStore";

/**
 * 로그인 화면 — 데이트길 브랜딩
 * 1. 코랄 하트 로고 + 데이트길 타이틀
 * 2. 카카오 노란 버튼 + Apple 검정 버튼
 * 3. 하단 이용약관 안내
 */

export default function LoginScreen() {
  const { login } = useAuthStore();

  const handleKakaoLogin = async () => {
    Alert.alert(
      "카카오 로그인",
      "카카오 네이티브 SDK 연동 후 활성화됩니다.\nEAS Development Build가 필요합니다."
    );
  };

  const handleAppleLogin = async () => {
    Alert.alert(
      "Apple 로그인",
      "expo-apple-authentication 연동 후 활성화됩니다.\nEAS Development Build가 필요합니다."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 브랜딩 영역 — 하트 로고 + 데이트길 */}
      <View style={styles.branding}>
        <View style={styles.logo}>
          <Text style={styles.logoHeart}>{"\u2764"}</Text>
        </View>
        <Text style={styles.title}>데이트길</Text>
        <Text style={styles.subtitle}>
          AI가 찾아주는{"\n"}완벽한 데이트 코스
        </Text>
      </View>

      {/* 2. 로그인 버튼 영역 */}
      <View style={styles.buttons}>
        <Button
          title="카카오로 시작하기"
          onPress={handleKakaoLogin}
          variant="kakao"
        />
        <Button
          title="Apple로 시작하기"
          onPress={handleAppleLogin}
          variant="apple"
        />
      </View>

      {/* 3. 하단 안내 */}
      <Text style={styles.notice}>
        시작하면 이용약관 및 개인정보처리방침에{"\n"}동의하는 것으로 간주합니다.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },
  branding: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoHeart: {
    fontSize: 26,
    color: COLORS.textInverse,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: "center",
    lineHeight: 20,
  },
  buttons: {
    gap: 10,
    marginBottom: 24,
  },
  notice: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
});
