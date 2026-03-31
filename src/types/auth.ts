/** 소셜 로그인 제공자 */
export type AuthProvider = "KAKAO" | "APPLE";

/** 사용자 역할 */
export type UserRole = "USER" | "ADMIN";

/** 로그인 요청 DTO */
export interface LoginRequest {
  provider: AuthProvider;
  providerAccessToken: string;
}

/** 로그인 응답 DTO */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  nickname: string;
  provider: AuthProvider;
}

/** 토큰 갱신 요청 DTO */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** 토큰 갱신 응답 DTO */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** 회원 프로필 */
export interface MemberProfile {
  id: number;
  nickname: string;
  provider: AuthProvider;
  role: UserRole;
  createdAt: string;
}
