import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
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
 * 1. 두 사람의 출발지(역 이름 또는 주소) 입력
 * 2. 입력값 검증 후 중간역 추천 API 호출
 * 3. 결과를 스토어에 저장하고 중간역 선택 화면으로 이동
 */

export default function OriginScreen() {
  const [originA, setOriginA] = useState("");
  const [originB, setOriginB] = useState("");
  const [loading, setLoading] = useState(false);
  const { setOrigins, setStationCandidates } = useCourseStore();
  const router = useRouter();

  const handleNext = async () => {
    // 1. 입력값 검증
    if (!originA.trim() || !originB.trim()) {
      Alert.alert("알림", "두 사람의 출발지를 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 2. 중간역 추천 API 호출
      // TODO: 주소 → 좌표 변환 (카카오맵 Geocoding API 연동 필요)
      // 현재는 임시 좌표 사용
      const response = await stationApi.recommendStations({
        originA: originA.trim(),
        originALat: 37.5665,
        originALng: 126.978,
        originB: originB.trim(),
        originBLat: 37.4979,
        originBLng: 127.0276,
      });

      // 3. 스토어에 결과 저장
      setOrigins({
        originA: originA.trim(),
        originALat: 37.5665,
        originALng: 126.978,
        originB: originB.trim(),
        originBLat: 37.4979,
        originBLng: 127.0276,
      });
      setStationCandidates(response.candidates);

      // 4. 중간역 선택 화면으로 이동
      router.push("/course/station");
    } catch (error) {
      Alert.alert("오류", "중간역 추천에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="중간역을 찾고 있어요..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 헤더 */}
      <Text style={styles.title}>어디서 출발하시나요?</Text>
      <Text style={styles.subtitle}>
        두 사람의 출발지를 입력하면{"\n"}중간에서 만날 역을 추천해드려요
      </Text>

      {/* 2. 출발지 입력 폼 */}
      <View style={styles.form}>
        <Input
          label="나의 출발지"
          value={originA}
          onChangeText={setOriginA}
          placeholder="역 이름 또는 주소를 입력하세요"
        />
        <Input
          label="상대방 출발지"
          value={originB}
          onChangeText={setOriginB}
          placeholder="역 이름 또는 주소를 입력하세요"
        />
      </View>

      {/* 3. 다음 단계 버튼 */}
      <Button
        title="중간역 찾기"
        onPress={handleNext}
        disabled={!originA.trim() || !originB.trim()}
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
    lineHeight: 22,
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
});
