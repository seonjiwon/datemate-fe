import { apiClient } from "./client";
import { ENDPOINTS, API_BASE_URL, API_VERSION } from "@/src/constants/api";
import { addMinutesToTime } from "@/src/utils/format";
import type {
  Course,
  CoursePlace,
  CourseCreateRequest,
  CourseShareResponse,
} from "@/src/types/course";
import type { ApiResponse } from "@/src/types/api";

/**
 * 코스 API — 백엔드 연동
 * 1. apiClient를 통해 localhost:8080 백엔드와 통신한다
 * 2. CustomResponse<T> 래퍼에서 result를 추출하여 반환한다
 * 3. 장소별 startTime을 코스 시작시각 기반으로 계산한다
 */

/**
 * 백엔드 응답의 places에 startTime을 계산하여 주입한다
 * - 코스 startTime 기반으로 각 장소의 체류시간 + 이동시간을 누적한다
 */
function enrichPlacesWithStartTime(course: Course): Course {
  let currentTime = course.startTime || "14:00";

  const enrichedPlaces: CoursePlace[] = course.places.map((place) => {
    const placeWithTime = { ...place, startTime: currentTime };
    // 다음 장소의 시작시각 = 현재 시작 + 체류시간 + 이동시간
    const stayMinutes = place.durationMinutes || 0;
    const travelMinutes = place.travelTimeToNext || 0;
    currentTime = addMinutesToTime(currentTime, stayMinutes + travelMinutes);
    return placeWithTime;
  });

  return { ...course, places: enrichedPlaces };
}

/** 코스 생성 — POST /api/v1/courses */
export const createCourse = async (
  params: CourseCreateRequest
): Promise<Course> => {
  const { data } = await apiClient.post<ApiResponse<Course>>(
    ENDPOINTS.COURSE.CREATE,
    params
  );
  return enrichPlacesWithStartTime(data.result);
};

/** 코스 상세 조회 — GET /api/v1/courses/{id} */
export const getCourseDetail = async (id: number): Promise<Course> => {
  const { data } = await apiClient.get<ApiResponse<Course>>(
    ENDPOINTS.COURSE.DETAIL(id)
  );
  return enrichPlacesWithStartTime(data.result);
};

/** 코스 확정 — POST /api/v1/courses/{id}/confirm */
export const confirmCourse = async (id: number): Promise<void> => {
  await apiClient.post(ENDPOINTS.COURSE.CONFIRM(id));
};

/** 코스 공유 토큰 발급 — POST /api/v1/courses/{id}/share */
export const shareCourse = async (
  id: number
): Promise<CourseShareResponse> => {
  const { data } = await apiClient.post<ApiResponse<CourseShareResponse>>(
    ENDPOINTS.COURSE.SHARE(id)
  );
  return data.result;
};

/** 공유 토큰으로 코스 조회 — GET /api/v1/courses/shared?token={token} */
export const getCourseByToken = async (token: string): Promise<Course> => {
  const { data } = await apiClient.get<ApiResponse<Course>>(
    ENDPOINTS.COURSE.BY_TOKEN,
    { params: { token } }
  );
  return enrichPlacesWithStartTime(data.result);
};

/** 내 코스 목록 조회 — GET /api/v1/courses/my */
export const getMyCourses = async (): Promise<Course[]> => {
  const { data } = await apiClient.get<ApiResponse<Course[]>>(
    ENDPOINTS.COURSE.MY_LIST
  );
  return (data.result || []).map(enrichPlacesWithStartTime);
};

/**
 * 장소 사진 URL 생성 — 백엔드 프록시를 통해 Google Places 이미지 가져오기
 * @param photoReference Google Places photo name (e.g. "places/ChIJ.../photos/AUac...")
 * @returns 프록시 URL 문자열
 */
export const getPlacePhotoUrl = (photoReference: string | null): string | null => {
  if (!photoReference) return null;
  return `${API_BASE_URL}${API_VERSION}${ENDPOINTS.PLACE.PHOTO}?ref=${encodeURIComponent(photoReference)}`;
};
