import { StyleSheet, View } from "react-native";
import { TextInput } from "./TextInput";
import { translations } from "@/utils/translations";
import { colors, spacing, typography } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { settings } from "@/utils/store";

interface SearchProps {
  onChangeText: (value: string) => void;
}
const SearchInput = ({ onChangeText }: SearchProps) => {
  return (
    <View
      style={[
        styles.searchContainer,
        {
          flexDirection: settings.get().isRTL ? "row-reverse" : "row",
        },
      ]}
    >
      <Ionicons name="search" size={20} color={colors.secondary} />
      <TextInput
        onChangeText={onChangeText}
        placeholder={translations.search}
        containerStyles={styles.inputContainer}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 9999,
    borderColor: colors.secondary,
    borderWidth: 2,
    gap: spacing.s,
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    fontSize: typography.s,
  },
});

export default SearchInput;
