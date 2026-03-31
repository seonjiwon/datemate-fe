import { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/src/components/common/Input";
import Button from "@/src/components/common/Button";
import Loading from "@/src/components/common/Loading";
import { COLORS } from "@/src/constants/colors";
import { useCourseStore } from "@/src/stores/useCourseStore";
import * as stationApi from "@/src/api/station";

/**
 * 출발지 입력 화면
 * 1. 코랄 도트(내 출발지) + 블루 도트(상대방) 입력 필드
 * 2. 최근 검색 리스트
 * 3. 중간역 추천 API 호출
 */

export default function OriginScreen() {
  const [originA, setOriginA] = useState("");
  const [originB, setOriginB] = useState("");
  const [loading, setLoading] = useState(false);
  const { setOrigins, setStationCandidates } = useCourseStore();
  const router = useRouter();

  const handleNext = async () => {
    if (!originA.trim() || !originB.trim()) {
      Alert.alert("알림", "두 사람의 출발지를 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await stationApi.recommendStations({
        originA: originA.trim(),
        originALat: 37.5665,
        originALng: 126.978,
        originB: originB.trim(),
        originBLat: 37.4979,
        originBLng: 127.0276,
      });

      setOrigins({
        originA: originA.trim(),
        originALat: 37.5665,
        originALng: 126.978,
        originB: originB.trim(),
        originBLat: 37.4979,
        originBLng: 127.0276,
      });
      setStationCandidates(response.candidates);
      router.push("/course/station");
    } catch (error) {
      Alert.alert("오류", "중간역 추천에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 최근 검색 터치 시 상대방 출발지에 자동 입력
  const handleRecentSearch = (station: string) => {
    if (!originB.trim()) {
      setOriginB(station);
    } else if (!originA.trim()) {
      setOriginA(station);
    }
  };

  if (loading) {
    return <Loading message="중간역을 찾고 있어요..." />;
  }

  const isReady = originA.trim().length > 0 && originB.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>출발지 입력</Text>
      </View>

      <Text style={styles.subtitle}>
        두 사람의 출발지를 각각 입력해주세요.{"\n"}
        중간에서 만날 수 있는 역을 찾아드릴게요.
      </Text>

      {/* 2. 출발지 입력 폼 */}
      <View style={styles.form}>
        <Input
          label="내 출발지"
          labelColor={COLORS.primary}
          value={originA}
          onChangeText={setOriginA}
          placeholder="역 이름 또는 주소 검색"
        />
        <Input
          label="상대방 출발지"
          labelColor={COLORS.partner}
          value={originB}
          onChangeText={setOriginB}
          placeholder="역 이름 또는 주소 검색"
        />

        {/* 3. 최근 검색 */}
        <Text style={styles.recentTitle}>최근 검색</Text>
        {["홍대입구역", "건대입구역", "신촌역"].map((s) => (
          <TouchableOpacity
            key={s}
            style={styles.recentItem}
            onPress={() => handleRecentSearch(s)}
          >
            <Text style={styles.recentIcon}>{"\u23F0"}</Text>
            <Text style={styles.recentText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 4. CTA 버튼 */}
      <Button
        title={isReady ? "중간역 찾기" : "출발지를 모두 입력해주세요"}
        onPress={handleNext}
        disabled={!isReady}
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
    marginBottom: 20,
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
  subtitle: {
    fontSize: 13,
    color: COLORS.textTertiary,
    lineHeight: 20,
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textTertiary,
    marginTop: 10,
    marginBottom: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceAlt,
  },
  recentIcon: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  recentText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
