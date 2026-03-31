/**
 * 데이트길 컬러 팔레트
 * 1. 메인 컬러: 코랄 로즈 (#F43F5E) 기반
 * 2. 파트너 구분: coral(나) / blue(상대방)
 * 3. 시맨틱 컬러 (배경, 텍스트, 상태) 분리
 */

export const COLORS = {
  // 브랜드 — 코랄 로즈 테마
  primary: "#F43F5E",
  primaryLight: "#FFF1F3",
  primaryDark: "#D6293E",

  // 파트너 구분 (상대방 = 블루)
  partner: "#4A90D9",
  partnerLight: "#EEF3FF",

  // 배경
  background: "#FFFFFF",
  surface: "#F5F5F5",
  surfaceAlt: "#F5F5F5",

  // 텍스트
  textPrimary: "#1A1A1A",
  textSecondary: "#555555",
  textTertiary: "#888888",
  textMuted: "#AAAAAA",
  textInverse: "#FFFFFF",

  // 상태
  success: "#27AE60",
  warning: "#F39C12",
  error: "#C0392B",

  // 경계선
  border: "#E5E5E5",
  borderLight: "#F0F0F0",

  // 카카오 / Apple
  kakao: "#FEE500",
  kakaoBrown: "#3C1E1E",
  apple: "#000000",

  // 분위기 태그 컬러 — 선택 시 primary 사용
  mood: {
    QUIET: "#F43F5E",
    ACTIVE: "#F43F5E",
    ROMANTIC: "#F43F5E",
    CASUAL: "#F43F5E",
  },
} as const;
