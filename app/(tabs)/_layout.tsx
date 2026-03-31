import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Slot, usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/src/constants/colors";

/**
 * 커스텀 탭 레이아웃
 * 1. expo-router의 <Tabs> 대신 <Slot> + 커스텀 탭바 사용
 * 2. <Tabs>가 Expo Go New Architecture(ReactFabric)에서
 *    네이티브 BottomTabBar 생성 시 JSI 타입 오류를 일으키므로 우회
 * 3. 순수 React Native View로 탭바를 그려서 호환성 문제 회피
 */

const TAB_ITEMS = [
  { name: "home", title: "홈", icon: "🏠" },
  { name: "my", title: "마이", icon: "👤" },
];

export default function TabLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* 현재 매칭된 라우트 렌더링 */}
      <Slot />

      {/* 커스텀 탭바 */}
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {TAB_ITEMS.map((tab) => {
          const isActive =
            pathname === `/${tab.name}` || pathname.startsWith(`/${tab.name}/`);

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => router.replace(`/(tabs)/${tab.name}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabTitle,
                  { color: isActive ? COLORS.primary : COLORS.textTertiary },
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.background,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabTitle: {
    fontSize: 10,
    fontWeight: "600",
  },
});
