import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * API 관련 상수
 * 1. 환경변수 EXPO_PUBLIC_API_URL이 있으면 최우선 사용
 * 2. 없으면 Expo 개발 서버 hostUri에서 Mac IP를 추출 → http://<Mac-IP>:8080
 *    (실제 기기에서 localhost:8080은 기기 자신을 가리키므로 불가)
 * 3. Android 에뮬레이터는 10.0.2.2 사용 (localhost 매핑)
 * 4. 모두 실패하면 localhost:8080 폴백 (iOS 시뮬레이터용)
 */

function resolveApiBaseUrl(): string {
  // 1) 환경변수 최우선
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2) Expo 개발 서버 hostUri에서 IP 추출 (e.g. "192.168.0.5:8081")
  const hostUri =
    Constants.expoConfig?.hostUri ?? (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(":")[0]; // "192.168.0.5"
    if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
      return `http://${ip}:8080`;
    }
  }

  // 3) Android 에뮬레이터 전용 주소
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  // 4) 폴백 — iOS 시뮬레이터·웹에서는 localhost 사용 가능
  return "http://localhost:8080";
}

export const API_BASE_URL = resolveApiBaseUrl();

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
    CONFIRM: (id: number) => `/courses/${id}/confirm`,
    SHARE: (id: number) => `/courses/${id}/share`,
    BY_TOKEN: "/courses/shared",
    MY_LIST: "/courses/my",
  },

  // 장소
  PLACE: {
    PHOTO: "/places/photo",
  },
} as const;
