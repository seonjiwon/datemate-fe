import { Redirect } from "expo-router";
import { useAuthStore } from "@/src/stores/useAuthStore";

/**
 * 앱 진입점 (/)
 * 1. 로그인 상태면 홈으로 리다이렉트
 * 2. 비로그인 상태면 로그인 화면으로 리다이렉트
 */

export default function Index() {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/auth/login" />;
}
