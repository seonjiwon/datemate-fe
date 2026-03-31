import { apiClient } from "./client";
import { ENDPOINTS } from "@/src/constants/api";
import type { ApiResponse } from "@/src/types/api";
import type { StationRequest, StationResponse } from "@/src/types/station";

/**
 * 중간역 API
 * 1. 두 출발지 좌표를 보내서 중간역 후보 2~3개를 받아온다
 */

/** 중간역 추천 요청 */
export const recommendStations = async (
  params: StationRequest
): Promise<StationResponse> => {
  const { data } = await apiClient.post<ApiResponse<StationResponse>>(
    ENDPOINTS.STATION.RECOMMEND,
    params
  );
  return data.data;
};
