import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useAuthStore } from "@/src/stores/useAuthStore";

/**
 * 로그인 화면
 * 1. 카카오 로그인 버튼
 * 2. Apple 로그인 버튼
 * 3. 소셜 SDK 연동 전까지는 TODO 알림으로 대체
 */

export default function LoginScreen() {
  const { login } = useAuthStore();

  // 1. 카카오 로그인 핸들러 (SDK 연동 전 placeholder)
  const handleKakaoLogin = async () => {
    // TODO: @react-native-seoul/kakao-login 연동 후 교체
    // const result = await KakaoLogin.login();
    // await login(result.accessToken, "KAKAO");
    Alert.alert(
      "카카오 로그인",
      "카카오 네이티브 SDK 연동 후 활성화됩니다.\nEAS Development Build가 필요합니다."
    );
  };

  // 2. Apple 로그인 핸들러 (SDK 연동 전 placeholder)
  const handleAppleLogin = async () => {
    // TODO: expo-apple-authentication 연동 후 교체
    // const credential = await AppleAuthentication.signInAsync({ ... });
    // await login(credential.identityToken, "APPLE");
    Alert.alert(
      "Apple 로그인",
      "expo-apple-authentication 연동 후 활성화됩니다.\nEAS Development Build가 필요합니다."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 브랜딩 영역 */}
      <View style={styles.branding}>
        <Text style={styles.title}>DateMate</Text>
        <Text style={styles.subtitle}>
          AI가 추천하는 완벽한 데이트 코스
        </Text>
      </View>

      {/* 2. 로그인 버튼 영역 */}
      <View style={styles.buttons}>
        <Button
          title="카카오로 시작하기"
          onPress={handleKakaoLogin}
          style={styles.kakaoButton}
        />
        <Button
          title="Apple로 시작하기"
          onPress={handleAppleLogin}
          variant="outline"
          style={styles.appleButton}
        />
      </View>

      {/* 3. 하단 안내 */}
      <Text style={styles.notice}>
        로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
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
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  buttons: {
    gap: 12,
    marginBottom: 24,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  appleButton: {
    borderColor: COLORS.textPrimary,
  },
  notice: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginBottom: 16,
  },
});
