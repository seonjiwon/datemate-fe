import { Redirect } from "expo-router";

/**
 * 앱 진입점 (/)
 * 1. 인증 여부와 무관하게 홈으로 바로 진입한다 (개발 모드)
 *
 * TODO: 프로덕션에서는 인증 상태 분기 복원할 것
 */

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
