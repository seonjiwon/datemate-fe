import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/constants/colors";

/**
 * 공용 태그 컴포넌트
 * 1. 선택 가능한 태그 (onPress + selected)
 * 2. 커스텀 컬러 지원 (분위기 태그 등)
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
  const activeColor = color || COLORS.primaryLight;

  return (
    <TouchableOpacity
      style={[
        styles.tag,
        selected && { backgroundColor: activeColor, borderColor: activeColor },
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
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  textSelected: {
    color: COLORS.textInverse,
  },
});
