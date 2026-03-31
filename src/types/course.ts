/** 분위기 태그 */
export type Mood = "QUIET" | "ACTIVE" | "ROMANTIC" | "CASUAL";

/** 이동 수단 */
export type Transport = "WALK" | "PUBLIC" | "CAR";

/** 코스 상태 */
export type CourseStatus = "CREATED" | "EXECUTED" | "EXPIRED";

/** 장소 카테고리 */
export type PlaceCategory =
  | "CAFE"
  | "RESTAURANT"
  | "ACTIVITY"
  | "BAR"
  | "PARK"
  | "CULTURE"
  | "SHOPPING";

/** 이동 방법 */
export type TravelMethod = "WALK" | "BUS" | "SUBWAY" | "CAR";

/** 코스 생성 요청 DTO */
export interface CourseCreateRequest {
  courseRequestId?: number;
  selectedStationId: number;
  budgetMin: number;
  budgetMax: number;
  mood: Mood;
  transport: Transport;
}

/** 코스 내 장소 */
export interface CoursePlace {
  id: number;
  placeId: number;
  placeName: string;
  category: PlaceCategory;
  address: string;
  latitude: number;
  longitude: number;
  rating: number | null;
  mapUrl: string | null;
  sequence: number;
  startTime: string;
  stayDuration: number;
  estimatedCost: number;
  description: string | null;
  travelMethodToNext: TravelMethod | null;
  travelTimeToNext: number | null;
}

/** 코스 */
export interface Course {
  id: number;
  courseRequestId: number;
  status: CourseStatus;
  totalEstimatedCost: number;
  totalDuration: number;
  placeCount: number;
  places: CoursePlace[];
  createdAt: string;
  executedAt: string | null;
}

/** 코스 생성 응답 DTO (후보 3~4개) */
export interface CourseCreateResponse {
  courseRequestId: number;
  courses: Course[];
}

/** 코스 공유 응답 DTO */
export interface CourseShareResponse {
  shareToken: string;
  shareUrl: string;
}
