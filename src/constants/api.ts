/**
 * API 관련 상수
 * 1. 환경변수에서 BASE_URL 읽기
 * 2. 엔드포인트 경로 정의
 */

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

export const API_VERSION = "/api/v1";

export const ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/me",
  },

  // 중간역
  STATION: {
    RECOMMEND: "/stations/recommend",
  },

  // 코스
  COURSE: {
    CREATE: "/courses",
    DETAIL: (id: number) => `/courses/${id}`,
    EXECUTE: (id: number) => `/courses/${id}/execute`,
    SHARE: (id: number) => `/courses/${id}/share`,
    BY_TOKEN: (token: string) => `/courses/shared/${token}`,
    MY_LIST: "/courses/my",
  },
} as const;
