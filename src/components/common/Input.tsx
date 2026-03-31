import { View, TextInput, Text, StyleSheet, type ViewStyle } from "react-native";
import { COLORS } from "@/src/constants/colors";

/**
 * 공용 텍스트 입력 컴포넌트
 * 1. label + input + error 메시지를 하나로 묶음
 * 2. error 상태 시 테두리 색상 변경
 */

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  style?: ViewStyle;
  editable?: boolean;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  style,
  editable = true,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {/* 1. 라벨 */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* 2. 입력 필드 */}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        editable={editable}
      />

      {/* 3. 에러 메시지 */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
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
