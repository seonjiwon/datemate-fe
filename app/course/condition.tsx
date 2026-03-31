import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
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
 * 조건 입력 화면 — 디자인 시안 반영
 * 1. 선택된 역 칩 (코랄 배경)
 * 2. 예산 프리셋 (선택 시 코랄 배경)
 * 3. 분위기 필(pill) 태그
 * 4. 이동수단 카드 (이모지 아이콘)
 * 5. 만남 시간
 * 6. AI 코스 생성 CTA
 */

const TRANSPORT_ICONS: Record<string, string> = {
  WALK: "\uD83D\uDEB6",
  PUBLIC: "\uD83D\uDE87",
  CAR: "\uD83D\uDE97",
};

export default function ConditionScreen() {
  const [budgetIndex, setBudgetIndex] = useState<number | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [transport, setTransport] = useState<Transport | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    selectedStation,
    originA, originALat, originALng,
    originB, originBLat, originBLng,
    setConditions, setCourseResults,
  } = useCourseStore();
  const router = useRouter();

  const isValid = budgetIndex !== null && mood !== null && transport !== null;

  const handleGenerate = async () => {
    if (!isValid || !selectedStation || budgetIndex === null) return;

    const budget = BUDGET_PRESETS[budgetIndex];

    setConditions({
      budgetMin: budget.min,
      budgetMax: budget.max,
      mood: mood!,
      transport: transport!,
    });

    setLoading(true);

    try {
      const course = await courseApi.createCourse({
        originAAddress: originA || "출발지A",
        originALat: originALat || 0,
        originALng: originALng || 0,
        originBAddress: originB || "출발지B",
        originBLat: originBLat || 0,
        originBLng: originBLng || 0,
        selectedStationName: selectedStation.stationName,
        selectedStationLat: selectedStation.latitude,
        selectedStationLng: selectedStation.longitude,
        budgetMin: budget.min,
        budgetMax: budget.max,
        mood: mood!,
        transport: transport!,
      });

      setCourseResults([course]);
      router.push("/course/result");
    } catch (error: any) {
      const msg = error?.response?.data?.message
        || error?.message
        || JSON.stringify(error);
      console.error("[ConditionScreen] 코스 생성 실패:", msg, error);
      Alert.alert("오류", `코스 생성에 실패했습니다.\n\n${msg}`);
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
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backArrow}>{"\u2190"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>코스 조건</Text>
        </View>

        {/* 2. 선택된 역 칩 */}
        <View style={styles.stationChip}>
          <View style={styles.chipDot} />
          <Text style={styles.chipText}>
            {selectedStation?.stationName || "역"} 주변
          </Text>
        </View>

        {/* 3. 예산 선택 */}
        <Text style={styles.sectionTitle}>1인 예산</Text>
        <View style={styles.budgetRow}>
          {BUDGET_PRESETS.map((preset, index) => (
            <TouchableOpacity
              key={preset.label}
              style={[
                styles.budgetItem,
                budgetIndex === index && styles.budgetItemActive,
              ]}
              onPress={() => setBudgetIndex(index)}
            >
              <Text
                style={[
                  styles.budgetText,
                  budgetIndex === index && styles.budgetTextActive,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. 분위기 선택 */}
        <Text style={styles.sectionTitle}>분위기</Text>
        <View style={styles.tagRow}>
          {MOOD_OPTIONS.map((option) => (
            <Tag
              key={option.value}
              label={option.label}
              selected={mood === option.value}
              onPress={() => setMood(option.value)}
            />
          ))}
        </View>

        {/* 5. 이동수단 선택 — 이모지 아이콘 카드 */}
        <Text style={styles.sectionTitle}>이동 수단</Text>
        <View style={styles.transportRow}>
          {TRANSPORT_OPTIONS.map((option) => {
            const isActive = transport === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.transportCard,
                  isActive && styles.transportCardActive,
                ]}
                onPress={() => setTransport(option.value)}
              >
                <Text style={styles.transportIcon}>
                  {TRANSPORT_ICONS[option.value]}
                </Text>
                <Text
                  style={[
                    styles.transportLabel,
                    isActive && styles.transportLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 6. 만남 시간 */}
        <Text style={styles.sectionTitle}>만남 시간</Text>
        <View style={styles.timeInput}>
          <Text style={styles.timeIcon}>{"\u23F0"}</Text>
          <Text style={styles.timeText}>오후 2:00</Text>
        </View>
      </ScrollView>

      {/* 7. CTA */}
      <Button
        title="AI 코스 생성하기"
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
  stationChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    alignSelf: "flex-start",
    marginBottom: 22,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginTop: 4,
  },
  budgetRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 22,
  },
  budgetItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },
  budgetItemActive: {
    backgroundColor: COLORS.primary,
  },
  budgetText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  budgetTextActive: {
    color: COLORS.textInverse,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 22,
  },
  transportRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 22,
  },
  transportCard: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  transportCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  transportIcon: {
    fontSize: 20,
  },
  transportLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textTertiary,
  },
  transportLabelActive: {
    color: COLORS.primary,
  },
  timeInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  timeIcon: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
});
