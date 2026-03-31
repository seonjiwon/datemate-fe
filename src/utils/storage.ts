import * as SecureStore from "expo-secure-store";

/**
 * SecureStore 래퍼
 * 1. 토큰 등 민감 데이터를 암호화된 저장소에 관리
 * 2. get/set/remove를 단일 인터페이스로 통합
 */

const KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  NICKNAME: "nickname",
  PROVIDER: "provider",
} as const;

export const storage = {
  /** 값 저장 */
  set: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },

  /** 값 조회 (없으면 null) */
  get: async (key: string): Promise<string | null> => {
    return SecureStore.getItemAsync(key);
  },

  /** 값 삭제 */
  remove: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },

  /** 로그인 정보 일괄 저장 */
  saveAuth: async (params: {
    accessToken: string;
    refreshToken: string;
    nickname: string;
    provider: string;
  }): Promise<void> => {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, params.accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, params.refreshToken),
      SecureStore.setItemAsync(KEYS.NICKNAME, params.nickname),
      SecureStore.setItemAsync(KEYS.PROVIDER, params.provider),
    ]);
  },

  /** 로그인 정보 일괄 조회 */
  getAuth: async () => {
    const [accessToken, refreshToken, nickname, provider] = await Promise.all([
      SecureStore.getItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.getItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.getItemAsync(KEYS.NICKNAME),
      SecureStore.getItemAsync(KEYS.PROVIDER),
    ]);
    return { accessToken, refreshToken, nickname, provider };
  },

  /** 로그인 정보 일괄 삭제 */
  clearAuth: async (): Promise<void> => {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.NICKNAME),
      SecureStore.deleteItemAsync(KEYS.PROVIDER),
    ]);
  },
};

export { KEYS };
