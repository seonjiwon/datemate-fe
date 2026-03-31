import type { StationCandidate, StationResponse } from "@/src/types/station";

/**
 * Mock 데이터
 * 1. 중간역 추천 API 전용 — 백엔드에 아직 중간역 엔드포인트가 없음
 * 2. 코스 API는 실제 백엔드 연동으로 전환됨
 *
 * TODO: 백엔드에 중간역 추천 API 구현 후 제거
 */

// ── 중간역 후보 ──
export const MOCK_STATION_CANDIDATES: StationCandidate[] = [
  {
    id: 1,
    stationName: "합정역",
    latitude: 37.5495,
    longitude: 126.9137,
    travelTimeFromA: 15,
    travelTimeFromB: 12,
  },
  {
    id: 2,
    stationName: "홍대입구역",
    latitude: 37.5571,
    longitude: 126.9246,
    travelTimeFromA: 18,
    travelTimeFromB: 10,
  },
  {
    id: 3,
    stationName: "상수역",
    latitude: 37.5478,
    longitude: 126.9227,
    travelTimeFromA: 12,
    travelTimeFromB: 15,
  },
];

export const MOCK_STATION_RESPONSE: StationResponse = {
  candidates: MOCK_STATION_CANDIDATES,
};
