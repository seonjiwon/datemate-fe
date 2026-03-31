/** 분위기 태그 */
export type Mood = "QUIET" | "ACTIVE" | "ROMANTIC" | "CASUAL";

/** 이동 수단 */
export type Transport = "WALK" | "PUBLIC" | "CAR";

/** 코스 상태 */
export type CourseStatus = "DRAFT" | "CONFIRMED" | "CREATED" | "EXECUTED" | "EXPIRED";

/** 장소 카테고리 */
export type PlaceCategory =
  | "CAFE"
  | "RESTAURANT"
  | "ACTIVITY"
  | "BAR"
  | "PARK"
  | "CULTURE"
  | "SHOPPING"
  | "ETC";

/** 이동 방법 */
export type TravelMethod = "WALK" | "BUS" | "SUBWAY" | "CAR";

/**
 * 코스 생성 요청 DTO — 백엔드 CourseCreateRequest 매핑
 * 출발지 A/B, 중간역, 조건 정보를 전달한다
 */
export interface CourseCreateRequest {
  originAAddress: string;
  originALat: number;
  originALng: number;
  originBAddress: string;
  originBLat: number;
  originBLng: number;
  selectedStationName: string;
  selectedStationLat: number;
  selectedStationLng: number;
  budgetMin: number;
  budgetMax: number;
  mood: Mood;
  transport: Transport;
}

/**
 * 코스 내 장소 — 백엔드 CoursePlaceResponse 매핑
 * 타임라인의 한 칸을 표현한다
 */
export interface CoursePlace {
  orderIndex: number;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  category: PlaceCategory;
  rating: number | null;
  durationMinutes: number;
  costMin: number;
  costMax: number;
  travelMethodToNext: TravelMethod | null;
  travelTimeToNext: number | null;
  memo: string | null;
  photoReference: string | null;
  /** 프론트엔드에서 계산하는 시작 시각 (HH:mm) */
  startTime?: string;
}

/**
 * 코스 — 백엔드 CourseResponse 매핑
 */
export interface Course {
  courseId: number;
  title: string;
  description: string | null;
  totalDuration: number;
  totalCostMin: number;
  totalCostMax: number;
  startTime: string;
  status: CourseStatus;
  places: CoursePlace[];
}

/** 코스 생성 응답 DTO — 단일 코스 반환 */
export interface CourseCreateResponse {
  course: Course;
}

/** 코스 공유 응답 DTO */
export interface CourseShareResponse {
  shareToken: string;
  shareUrl: string;
}
