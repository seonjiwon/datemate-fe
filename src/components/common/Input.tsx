import { View, TextInput, Text, StyleSheet, type ViewStyle } from "react-native";
import { COLORS } from "@/src/constants/colors";

/**
 * 공용 텍스트 입력 컴포넌트
 * 1. label + 컬러 도트 + input + error 메시지
 * 2. labelColor로 라벨 및 도트 색상 지정 (기본: coral)
 * 3. 값 입력 시 보더 컬러 하이라이트
 */

interface InputProps {
  label?: string;
  labelColor?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  style?: ViewStyle;
  editable?: boolean;
}

export default function Input({
  label,
  labelColor = COLORS.primary,
  value,
  onChangeText,
  placeholder,
  error,
  style,
  editable = true,
}: InputProps) {
  const hasValue = value.trim().length > 0;

  return (
    <View style={[styles.container, style]}>
      {/* 1. 라벨 */}
      {label && (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}

      {/* 2. 입력 필드 + 컬러 도트 */}
      <View
        style={[
          styles.inputWrapper,
          hasValue && {
            borderColor: labelColor,
            backgroundColor:
              labelColor === COLORS.primary
                ? COLORS.primaryLight
                : COLORS.background,
          },
          error && styles.inputError,
        ]}
      >
        <View style={[styles.dot, { backgroundColor: labelColor }]} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          editable={editable}
        />
      </View>

      {/* 3. 에러 메시지 */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
});
