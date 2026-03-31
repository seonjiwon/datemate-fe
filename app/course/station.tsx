import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import StationCard from "@/src/components/station/StationCard";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useCourseStore } from "@/src/stores/useCourseStore";

/**
 * 중간역 선택 화면
 * 1. 추천된 중간역 후보 2~3개를 카드로 표시
 * 2. 사용자가 하나를 선택
 * 3. 선택 후 조건 입력 화면으로 이동
 */

export default function StationScreen() {
  const { stationCandidates, selectedStation, selectStation } =
    useCourseStore();
  const router = useRouter();

  const handleNext = () => {
    // 1. 선택 검증
    if (!selectedStation) {
      Alert.alert("알림", "만날 역을 선택해주세요.");
      return;
    }

    // 2. 조건 입력 화면으로 이동
    router.push("/course/condition");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 헤더 */}
      <Text style={styles.title}>어디서 만날까요?</Text>
      <Text style={styles.subtitle}>
        양쪽 모두 이동하기 편한 역을 추천했어요
      </Text>

      {/* 2. 중간역 후보 목록 */}
      <FlatList
        data={stationCandidates}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <StationCard
            station={item}
            selected={selectedStation?.id === item.id}
            onPress={() => selectStation(item)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* 3. 다음 단계 버튼 */}
      <Button
        title="이 역으로 정하기"
        onPress={handleNext}
        disabled={!selectedStation}
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  list: {
    paddingBottom: 16,
  },
});
