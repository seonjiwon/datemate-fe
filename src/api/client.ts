import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_VERSION, ENDPOINTS } from "@/src/constants/api";
import { storage, KEYS } from "@/src/utils/storage";
import type { ApiError } from "@/src/types/api";
import type { RefreshTokenResponse } from "@/src/types/auth";

/**
 * Axios 인스턴스
 * 1. baseURL, timeout, 기본 헤더 설정
 * 2. 요청 인터셉터: accessToken 자동 첨부
 * 3. 응답 인터셉터: 401 시 토큰 갱신 → 실패 시 로그아웃
 */

const fullBaseURL = `${API_BASE_URL}${API_VERSION}`;
console.log("[apiClient] baseURL =", fullBaseURL);

export const apiClient = axios.create({
  baseURL: fullBaseURL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// ── 요청 인터셉터 ──
apiClient.interceptors.request.use(async (config) => {
  // 1. SecureStore에서 accessToken 조회
  const token = await storage.get(KEYS.ACCESS_TOKEN);

  // 2. 토큰이 있으면 Authorization 헤더에 첨부
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ── 응답 인터셉터 ──
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 1. 401이 아니거나, 이미 재시도한 요청이면 그대로 에러 반환
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 2. 토큰 갱신이 이미 진행 중이면 대기열에 추가
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    // 3. 토큰 갱신 시도
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await storage.get(KEYS.REFRESH_TOKEN);
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post<{ isSuccess: boolean; result: RefreshTokenResponse }>(
        `${API_BASE_URL}${API_VERSION}${ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      const newAccessToken = data.result.accessToken;

      // 4. 새 토큰 저장
      await storage.set(KEYS.ACCESS_TOKEN, newAccessToken);
      await storage.set(KEYS.REFRESH_TOKEN, data.result.refreshToken);

      // 5. 대기 중이던 요청들에 새 토큰 전달
      pendingRequests.forEach((cb) => cb(newAccessToken));
      pendingRequests = [];

      // 6. 원래 요청 재시도
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch {
      // 7. 갱신 실패 시 로그인 정보 삭제 (로그아웃)
      await storage.clearAuth();
      pendingRequests = [];
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);
