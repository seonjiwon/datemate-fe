import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * SecureStore 래퍼
 * 1. 토큰 등 민감 데이터를 암호화된 저장소에 관리
 * 2. get/set/remove를 단일 인터페이스로 통합
 * 3. 웹 환경에서는 SecureStore를 사용할 수 없으므로 localStorage로 폴백한다
 *    — 웹은 개발/미리보기 용도이므로 보안 수준 차이는 허용한다
 */

// 1. 플랫폼별 저수준 어댑터를 정의한다
// 2. 네이티브에서는 SecureStore, 웹에서는 localStorage를 사용한다
const adapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  deleteItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  NICKNAME: "nickname",
  PROVIDER: "provider",
} as const;

export const storage = {
  /** 값 저장 */
  set: async (key: string, value: string): Promise<void> => {
    await adapter.setItem(key, value);
  },

  /** 값 조회 (없으면 null) */
  get: async (key: string): Promise<string | null> => {
    return adapter.getItem(key);
  },

  /** 값 삭제 */
  remove: async (key: string): Promise<void> => {
    await adapter.deleteItem(key);
  },

  /** 로그인 정보 일괄 저장 */
  saveAuth: async (params: {
    accessToken: string;
    refreshToken: string;
    nickname: string;
    provider: string;
  }): Promise<void> => {
    await Promise.all([
      adapter.setItem(KEYS.ACCESS_TOKEN, params.accessToken),
      adapter.setItem(KEYS.REFRESH_TOKEN, params.refreshToken),
      adapter.setItem(KEYS.NICKNAME, params.nickname),
      adapter.setItem(KEYS.PROVIDER, params.provider),
    ]);
  },

  /** 로그인 정보 일괄 조회 */
  getAuth: async () => {
    const [accessToken, refreshToken, nickname, provider] = await Promise.all([
      adapter.getItem(KEYS.ACCESS_TOKEN),
      adapter.getItem(KEYS.REFRESH_TOKEN),
      adapter.getItem(KEYS.NICKNAME),
      adapter.getItem(KEYS.PROVIDER),
    ]);
    return { accessToken, refreshToken, nickname, provider };
  },

  /** 로그인 정보 일괄 삭제 */
  clearAuth: async (): Promise<void> => {
    await Promise.all([
      adapter.deleteItem(KEYS.ACCESS_TOKEN),
      adapter.deleteItem(KEYS.REFRESH_TOKEN),
      adapter.deleteItem(KEYS.NICKNAME),
      adapter.deleteItem(KEYS.PROVIDER),
    ]);
  },
};

export { KEYS };
