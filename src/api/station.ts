import type { StationRequest, StationResponse } from "@/src/types/station";
import { MOCK_STATION_RESPONSE } from "./__mock__/data";

/**
 * 중간역 API (Mock 모드)
 * 1. 백엔드 미연동 상태에서 mock 데이터를 반환한다
 * 2. 500ms 딜레이로 네트워크 지연을 시뮬레이션한다
 *
 * TODO: 백엔드 연동 시 apiClient.post 호출로 교체
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 중간역 추천 요청 (mock) */
export const recommendStations = async (
  _params: StationRequest
): Promise<StationResponse> => {
  // 1. 네트워크 지연 시뮬레이션
  await delay(500);

  // 2. mock 데이터 반환
  return MOCK_STATION_RESPONSE;
};
