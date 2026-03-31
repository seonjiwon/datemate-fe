import { create } from "zustand";
import { storage } from "@/src/utils/storage";
import * as authApi from "@/src/api/auth";
import type { AuthProvider } from "@/src/types/auth";

/**
 * 인증 상태 스토어
 * 1. 앱 시작 시 SecureStore에서 토큰 복원 (initialize)
 * 2. 소셜 로그인 → 서버 JWT 발급 → 저장
 * 3. 로그아웃 → 서버 + 로컬 토큰 삭제
 */

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  accessToken: string | null;
  nickname: string | null;
  provider: AuthProvider | null;
}

interface AuthActions {
  /** 앱 시작 시 호출: SecureStore에서 기존 토큰 복원 */
  initialize: () => Promise<void>;

  /** 소셜 로그인: 프로바이더 토큰 → 서버 JWT 교환 → 저장 */
  login: (
    providerAccessToken: string,
    provider: AuthProvider
  ) => Promise<void>;

  /** 로그아웃: 서버 무효화 + 로컬 삭제 */
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isLoggedIn: false,
  isLoading: true,
  accessToken: null,
  nickname: null,
  provider: null,

  initialize: async () => {
    try {
      // 1. SecureStore에서 저장된 인증 정보 조회
      const auth = await storage.getAuth();

      // 2. accessToken이 있으면 로그인 상태로 복원
      if (auth.accessToken) {
        set({
          isLoggedIn: true,
          accessToken: auth.accessToken,
          nickname: auth.nickname,
          provider: auth.provider as AuthProvider,
        });
      }
    } finally {
      // 3. 어떤 경우든 로딩 종료
      set({ isLoading: false });
    }
  },

  login: async (providerAccessToken, provider) => {
    // 1. 서버에 소셜 토큰을 보내서 JWT 발급
    const response = await authApi.login({
      provider,
      providerAccessToken,
    });

    // 2. 발급받은 토큰과 프로필을 SecureStore에 저장
    await storage.saveAuth({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      nickname: response.nickname,
      provider,
    });

    // 3. 상태 업데이트
    set({
      isLoggedIn: true,
      accessToken: response.accessToken,
      nickname: response.nickname,
      provider,
    });
  },

  logout: async () => {
    try {
      // 1. 서버에 로그아웃 요청 (리프레시 토큰 무효화)
      await authApi.logout();
    } finally {
      // 2. 로컬 토큰 삭제 (서버 요청 실패해도 로컬은 삭제)
      await storage.clearAuth();

      // 3. 상태 초기화
      set({
        isLoggedIn: false,
        accessToken: null,
        nickname: null,
        provider: null,
      });
    }
  },
}));
