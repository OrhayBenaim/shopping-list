import { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { colors, spacing, typography } from "@/utils/theme";

interface TagProps {
  label: string;
  onPress: (state: boolean) => void;
}
const Tag = ({ label, onPress }: TagProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  const onToggle = () => {
    setSelected((s) => !s);
    onPress(!selected);
  };

  return (
    <TouchableOpacity
      onPress={onToggle}
      aria-selected={selected}
      style={[styles.button, selected && styles.selectedButton]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.foreground,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.s / 2,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  text: {
    fontSize: typography.s,
    color: colors.secondary,
  },

  selectedText: {
    color: colors.foreground,
  },
  selectedButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.foreground,
  },
});

export default Tag;
