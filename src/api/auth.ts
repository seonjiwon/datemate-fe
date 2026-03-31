import { apiClient } from "./client";
import { ENDPOINTS } from "@/src/constants/api";
import type { ApiResponse } from "@/src/types/api";
import type {
  LoginRequest,
  LoginResponse,
  MemberProfile,
} from "@/src/types/auth";

/**
 * 인증 API
 * 1. 소셜 로그인 (카카오/Apple 토큰 → 서버 JWT 교환)
 * 2. 로그아웃
 * 3. 프로필 조회
 */

/** 로그인: 소셜 프로바이더 토큰으로 서버 JWT 발급 */
export const login = async (params: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    ENDPOINTS.AUTH.LOGIN,
    params
  );
  return data.result;
};

/** 로그아웃: 서버에 리프레시 토큰 무효화 요청 */
export const logout = async (): Promise<void> => {
  await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
};

/** 내 프로필 조회 */
export const getProfile = async (): Promise<MemberProfile> => {
  const { data } = await apiClient.get<ApiResponse<MemberProfile>>(
    ENDPOINTS.AUTH.PROFILE
  );
  return data.result;
};
