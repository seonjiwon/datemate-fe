import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/src/stores/useAuthStore";
import Loading from "@/src/components/common/Loading";

/**
 * 루트 레이아웃
 * 1. 앱 시작 시 SecureStore에서 인증 상태 복원
 * 2. 로그인 여부에 따라 auth 그룹 ↔ tabs 그룹 자동 리다이렉트
 * 3. 로딩 중에는 스피너 표시
 */

export default function RootLayout() {
  const { isLoggedIn, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 1. 앱 시작 시 인증 상태 복원
  useEffect(() => {
    initialize();
  }, []);

  // 2. 인증 상태에 따라 화면 분기
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isLoggedIn && !inAuthGroup) {
      // 비로그인 상태인데 auth 밖에 있으면 → 로그인 화면으로
      router.replace("/auth/login");
    } else if (isLoggedIn && inAuthGroup) {
      // 로그인 상태인데 auth 안에 있으면 → 홈으로
      router.replace("/(tabs)/home");
    }
  }, [isLoggedIn, isLoading, segments]);

  // 3. 로딩 중 스피너
  if (isLoading) {
    return <Loading message="잠시만 기다려주세요" />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}
