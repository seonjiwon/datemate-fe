/**
 * DateMate 컬러 팔레트
 * 1. 브랜드 컬러 정의
 * 2. 시맨틱 컬러 (배경, 텍스트, 상태) 분리
 */

export const COLORS = {
  // 브랜드
  primary: "#1B3A5C",
  primaryLight: "#2E75B6",
  primaryBg: "#E8F0F8",

  // 배경
  background: "#FFFFFF",
  surface: "#F5F7FA",
  surfaceAlt: "#EEF2F7",

  // 텍스트
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  textTertiary: "#999999",
  textInverse: "#FFFFFF",

  // 상태
  success: "#27AE60",
  warning: "#F39C12",
  error: "#C0392B",

  // 경계선
  border: "#E0E0E0",
  borderLight: "#F0F0F0",

  // 분위기 태그 컬러
  mood: {
    QUIET: "#7B9EC7",
    ACTIVE: "#E67E22",
    ROMANTIC: "#E74C8B",
    CASUAL: "#2ECC71",
  },
} as const;
