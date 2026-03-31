import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

/**
 * 공용 태그 컴포넌트
 * 1. 선택 가능한 필(pill) 태그 — 코랄 테마
 * 2. 선택 시 배경 코랄 + 흰색 텍스트
 * 3. 미선택 시 흰색 배경 + 보더
 */

interface TagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
}

export default function Tag({
  label,
  selected = false,
  onPress,
  color,
}: TagProps) {
  const activeColor = color || COLORS.primary;

  return (
    <TouchableOpacity
      style={[
        styles.tag,
        selected && {
          backgroundColor: activeColor,
          borderColor: activeColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  textSelected: {
    color: COLORS.textInverse,
  },
});
