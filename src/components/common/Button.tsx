import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { COLORS } from "@/src/constants/colors";

/**
 * 공용 버튼 컴포넌트
 * 1. variant(primary/secondary/outline/kakao/apple)로 스타일 분기
 * 2. loading 상태 시 스피너 표시 + 터치 비활성화
 * 3. disabled 상태 처리
 * 4. icon prop으로 좌측 아이콘 삽입 가능
 */

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "kakao" | "apple";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? COLORS.primary : COLORS.textInverse}
        />
      ) : (
        <View style={styles.inner}>
          {icon}
          <Text style={[styles.text, textVariantStyles[variant]]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});

const variantStyles: Record<string, ViewStyle> = {
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.primaryLight },
  outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: COLORS.primary },
  kakao: { backgroundColor: COLORS.kakao },
  apple: { backgroundColor: COLORS.apple },
};

const textVariantStyles: Record<string, TextStyle> = {
  primary: { color: COLORS.textInverse },
  secondary: { color: COLORS.primary },
  outline: { color: COLORS.primary },
  kakao: { color: COLORS.kakaoBrown },
  apple: { color: COLORS.textInverse },
};
