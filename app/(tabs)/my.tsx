import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useAuthStore } from "@/src/stores/useAuthStore";

/**
 * 마이페이지 화면
 * 1. 프로필 정보 표시 (닉네임, 로그인 제공자)
 * 2. 로그아웃 버튼
 */

export default function MyScreen() {
  const { nickname, provider, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 프로필 정보 */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {nickname?.charAt(0) || "?"}
          </Text>
        </View>
        <Text style={styles.nickname}>{nickname || "사용자"}</Text>
        <Text style={styles.provider}>
          {provider === "KAKAO" ? "카카오" : "Apple"} 로그인
        </Text>
      </View>

      {/* 2. 메뉴 영역 (v1.1에서 내 코스 목록 등 추가 예정) */}
      <View style={styles.menu}>
        <Text style={styles.menuPlaceholder}>
          내 코스 목록은 v1.1에서 추가됩니다
        </Text>
      </View>

      {/* 3. 로그아웃 */}
      <Button
        title="로그아웃"
        onPress={handleLogout}
        variant="outline"
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
  profile: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
  nickname: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  provider: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  menu: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuPlaceholder: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
});
