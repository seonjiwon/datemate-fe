import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Tag from "@/src/components/common/Tag";
import Button from "@/src/components/common/Button";
import Loading from "@/src/components/common/Loading";
import { COLORS } from "@/src/constants/colors";
import {
  MOOD_OPTIONS,
  TRANSPORT_OPTIONS,
  BUDGET_PRESETS,
} from "@/src/constants/mood";
import { useCourseStore } from "@/src/stores/useCourseStore";
import * as courseApi from "@/src/api/course";
import type { Mood, Transport } from "@/src/types/course";

/**
 * 조건 입력 화면
 * 1. 예산 범위 선택 (프리셋)
 * 2. 분위기 태그 선택
 * 3. 이동 수단 선택
 * 4. 조건 확정 후 AI 코스 생성 API 호출
 */

export default function ConditionScreen() {
  const [budgetIndex, setBudgetIndex] = useState<number | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [transport, setTransport] = useState<Transport | null>(null);
  const [loading, setLoading] = useState(false);

  const { selectedStation, setConditions, setCourseResults } =
    useCourseStore();
  const router = useRouter();

  const isValid = budgetIndex !== null && mood !== null && transport !== null;

  const handleGenerate = async () => {
    // 1. 입력값 검증
    if (!isValid || !selectedStation || budgetIndex === null) return;

    const budget = BUDGET_PRESETS[budgetIndex];

    // 2. 스토어에 조건 저장
    setConditions({
      budgetMin: budget.min,
      budgetMax: budget.max,
      mood: mood!,
      transport: transport!,
    });

    setLoading(true);

    try {
      // 3. AI 코스 생성 API 호출
      const response = await courseApi.createCourse({
        selectedStationId: selectedStation.id,
        budgetMin: budget.min,
        budgetMax: budget.max,
        mood: mood!,
        transport: transport!,
      });

      // 4. 결과 저장 후 결과 화면으로 이동
      setCourseResults(response.courseRequestId, response.courses);
      router.push("/course/result");
    } catch (error) {
      Alert.alert("오류", "코스 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="AI가 코스를 만들고 있어요..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. 헤더 */}
        <Text style={styles.title}>어떤 데이트를 원하세요?</Text>
        <Text style={styles.subtitle}>
          {selectedStation?.stationName} 주변에서 찾아볼게요
        </Text>

        {/* 2. 예산 선택 */}
        <Text style={styles.sectionTitle}>예산 (1인 기준)</Text>
        <View style={styles.tagRow}>
          {BUDGET_PRESETS.map((preset, index) => (
            <Tag
              key={preset.label}
              label={preset.label}
              selected={budgetIndex === index}
              onPress={() => setBudgetIndex(index)}
            />
          ))}
        </View>

        {/* 3. 분위기 선택 */}
        <Text style={styles.sectionTitle}>분위기</Text>
        <View style={styles.tagRow}>
          {MOOD_OPTIONS.map((option) => (
            <Tag
              key={option.value}
              label={option.label}
              selected={mood === option.value}
              onPress={() => setMood(option.value)}
              color={COLORS.mood[option.value]}
            />
          ))}
        </View>

        {/* 4. 이동 수단 선택 */}
        <Text style={styles.sectionTitle}>이동 수단</Text>
        <View style={styles.tagRow}>
          {TRANSPORT_OPTIONS.map((option) => (
            <Tag
              key={option.value}
              label={option.label}
              selected={transport === option.value}
              onPress={() => setTransport(option.value)}
            />
          ))}
        </View>
      </ScrollView>

      {/* 5. 코스 생성 버튼 */}
      <Button
        title="코스 추천받기"
        onPress={handleGenerate}
        disabled={!isValid}
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
});
