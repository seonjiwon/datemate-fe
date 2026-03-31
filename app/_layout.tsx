import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/src/stores/useAuthStore";
import Loading from "@/src/components/common/Loading";

/**
 * 루트 레이아웃
 * 1. 앱 시작 시 SecureStore에서 인증 상태 복원 시도
 * 2. 로그인 여부와 무관하게 모든 화면 접근 허용 (개발 모드)
 * 3. 로딩 중에는 스피너 표시
 *
 * TODO: 프로덕션에서는 인증 가드를 다시 활성화할 것
 */

export default function RootLayout() {
  const { isLoading, initialize } = useAuthStore();

  // 1. 앱 시작 시 인증 상태 복원 (실패해도 진행 가능)
  useEffect(() => {
    initialize();
  }, []);

  // 2. 로딩 중 스피너
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
