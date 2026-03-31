import {
  View,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";
import { COLORS } from "@/src/constants/colors";

/**
 * 공용 카드 컴포넌트
 * 1. 터치 가능한 카드(onPress 전달 시)와 정적 카드 분기
 * 2. 선택 상태(selected) 시 코랄 테두리 + 연한 배경 강조
 */

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  style?: ViewStyle;
}

export default function Card({
  children,
  onPress,
  selected = false,
  style,
}: CardProps) {
  const content = (
    <View style={[styles.card, selected && styles.selected, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selected: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    backgroundColor: COLORS.primaryLight,
  },
});
