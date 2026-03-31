/** 중간역 추천 요청 DTO */
export interface StationRequest {
  originA: string;
  originALat: number;
  originALng: number;
  originB: string;
  originBLat: number;
  originBLng: number;
}

/** 중간역 후보 */
export interface StationCandidate {
  id: number;
  stationName: string;
  latitude: number;
  longitude: number;
  travelTimeFromA: number;
  travelTimeFromB: number;
}

/** 중간역 추천 응답 DTO */
export interface StationResponse {
  candidates: StationCandidate[];
}
