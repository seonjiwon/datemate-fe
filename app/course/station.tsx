import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import StationCard from "@/src/components/station/StationCard";
import Button from "@/src/components/common/Button";
import { COLORS } from "@/src/constants/colors";
import { useCourseStore } from "@/src/stores/useCourseStore";

/**
 * 중간역 선택 화면
 * 1. 출발지 요약 칩 (코랄=나, 블루=상대방)
 * 2. 추천 역 카드 (선택 시 코랄 보더 + 추천 뱃지)
 * 3. CTA 버튼
 */

export default function StationScreen() {
  const {
    stationCandidates,
    selectedStation,
    selectStation,
    originA,
    originB,
  } = useCourseStore();
  const router = useRouter();

  const handleNext = () => {
    if (!selectedStation) {
      Alert.alert("알림", "만날 역을 선택해주세요.");
      return;
    }
    router.push("/course/condition");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>중간역 추천</Text>
      </View>

      {/* 2. 출발지 요약 칩 */}
      <View style={styles.originRow}>
        <View style={[styles.originChip, { backgroundColor: COLORS.primaryLight }]}>
          <Text style={[styles.originLabel, { color: COLORS.primary }]}>내 출발지</Text>
          <Text style={styles.originName}>{originA || "미입력"}</Text>
        </View>
        <View style={[styles.originChip, { backgroundColor: COLORS.partnerLight }]}>
          <Text style={[styles.originLabel, { color: COLORS.partner }]}>상대방</Text>
          <Text style={styles.originName}>{originB || "미입력"}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>양쪽 모두 편한 중간 지점이에요</Text>

      {/* 3. 중간역 후보 목록 */}
      <FlatList
        data={stationCandidates}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <StationCard
            station={item}
            selected={selectedStation?.id === item.id}
            onPress={() => selectStation(item)}
            isRecommended={index === 0}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* 4. CTA 버튼 */}
      <Button
        title={selectedStation ? `${selectedStation.stationName}으로 선택` : "역을 선택해주세요"}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 12,
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  originRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  originChip: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  originLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 2,
  },
  originName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 14,
  },
  list: {
    paddingBottom: 16,
  },
});
