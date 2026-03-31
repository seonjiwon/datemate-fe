import { Tabs } from "expo-router";
import { COLORS } from "@/src/constants/colors";

/**
 * 탭 네비게이션 레이아웃
 * 1. 홈 탭 (코스 생성 시작점)
 * 2. 마이페이지 탭
 */

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          borderTopColor: COLORS.borderLight,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          // TODO: 아이콘 추가 (lucide-react-native 등)
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "마이",
          // TODO: 아이콘 추가
        }}
      />
    </Tabs>
  );
}
