import type { Mood, Transport } from "@/src/types/course";

/**
 * 분위기/이동수단 태그 라벨 매핑
 * 1. 타입 → 한글 라벨 변환
 * 2. UI에서 태그 렌더링 시 사용
 */

export const MOOD_LABELS: Record<Mood, string> = {
  QUIET: "조용한",
  ACTIVE: "활동적",
  ROMANTIC: "로맨틱",
  CASUAL: "캐주얼",
};

export const TRANSPORT_LABELS: Record<Transport, string> = {
  WALK: "도보",
  PUBLIC: "대중교통",
  CAR: "자차",
};

export const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: "QUIET", label: "조용한" },
  { value: "ACTIVE", label: "활동적" },
  { value: "ROMANTIC", label: "로맨틱" },
  { value: "CASUAL", label: "캐주얼" },
];

export const TRANSPORT_OPTIONS: { value: Transport; label: string }[] = [
  { value: "WALK", label: "도보" },
  { value: "PUBLIC", label: "대중교통" },
  { value: "CAR", label: "자차" },
];

/** 예산 프리셋 (1인 기준, 원) */
export const BUDGET_PRESETS = [
  { label: "1만원 이하", min: 0, max: 10000 },
  { label: "1~3만원", min: 10000, max: 30000 },
  { label: "3~5만원", min: 30000, max: 50000 },
  { label: "5만원 이상", min: 50000, max: 100000 },
];
