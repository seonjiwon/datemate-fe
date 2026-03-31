import { apiClient } from "./client";
import { ENDPOINTS } from "@/src/constants/api";
import type { ApiResponse } from "@/src/types/api";
import type {
  Course,
  CourseCreateRequest,
  CourseCreateResponse,
  CourseShareResponse,
} from "@/src/types/course";

/**
 * 코스 API
 * 1. 조건 기반 AI 코스 생성
 * 2. 코스 상세 조회 / 실행 처리 / 공유
 * 3. 내 코스 목록 조회
 */

/** 코스 생성: 조건을 보내서 AI 코스 후보 3~4개를 받아온다 */
export const createCourse = async (
  params: CourseCreateRequest
): Promise<CourseCreateResponse> => {
  const { data } = await apiClient.post<ApiResponse<CourseCreateResponse>>(
    ENDPOINTS.COURSE.CREATE,
    params
  );
  return data.data;
};

/** 코스 상세 조회 */
export const getCourseDetail = async (id: number): Promise<Course> => {
  const { data } = await apiClient.get<ApiResponse<Course>>(
    ENDPOINTS.COURSE.DETAIL(id)
  );
  return data.data;
};

/** 코스 실행 처리: status를 EXECUTED로 변경 */
export const executeCourse = async (id: number): Promise<void> => {
  await apiClient.post(ENDPOINTS.COURSE.EXECUTE(id));
};

/** 코스 공유 토큰 발급 */
export const shareCourse = async (
  id: number
): Promise<CourseShareResponse> => {
  const { data } = await apiClient.post<ApiResponse<CourseShareResponse>>(
    ENDPOINTS.COURSE.SHARE(id)
  );
  return data.data;
};

/** 공유 토큰으로 코스 조회 (비로그인 가능) */
export const getCourseByToken = async (token: string): Promise<Course> => {
  const { data } = await apiClient.get<ApiResponse<Course>>(
    ENDPOINTS.COURSE.BY_TOKEN(token)
  );
  return data.data;
};

/** 내 코스 목록 조회 */
export const getMyCourses = async (): Promise<Course[]> => {
  const { data } = await apiClient.get<ApiResponse<Course[]>>(
    ENDPOINTS.COURSE.MY_LIST
  );
  return data.data;
};
