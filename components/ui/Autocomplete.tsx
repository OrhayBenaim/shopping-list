import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import {
  StyleProp,
  ViewStyle,
  TextInputProps,
  View,
  StyleSheet,
} from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { observer } from "@legendapp/state/react";
import { Text } from "./Text";
import { settings } from "@/utils/store";
import { translations } from "@/utils/translations";
import { CustomAutocompleteItem } from "./CustomAutocompleteItem";
import { colors, spacing, typography } from "@/utils/theme";

interface AutocompleteProps extends TextInputProps {
  options: { id: string; title: string }[];
  label?: string;
  error?: boolean;
  errorText?: string;
  containerStyles?: StyleProp<ViewStyle>;
}

export const AutoComplete = observer((props: AutocompleteProps) => {
  const autoCompleteRef = useRef<any>(null);
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  const initialValue = useMemo(() => {
    return props.value;
  }, []);
  const propsStyle = useMemo(() => {
    return Array.isArray(props.style) ? props.style : [props.style];
  }, [props.style]);

  const containerStyles = useMemo(() => {
    return Array.isArray(props.containerStyles)
      ? props.containerStyles
      : [props.containerStyles];
  }, [props.containerStyles]);

  const filteredItems = useMemo(() => {
    return props.options.filter((item) =>
      item.title
        .toLocaleLowerCase()
        .includes((props.value || "").toLocaleLowerCase())
    );
  }, [props.options, props.value]);

  const onSelectItem = useCallback(
    (item: AutocompleteDropdownItem) => {
      autoCompleteRef.current?.setItem(item);
      autoCompleteRef.current?.blur();
      autoCompleteRef.current?.close();
    },
    [autoCompleteRef.current]
  );

  return (
    <View style={containerStyles}>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <AutocompleteDropdown
        {...props}
        controller={(controller) => {
          autoCompleteRef.current = controller;
        }}
        initialValue={initialValue}
        useFilter={true}
        renderItem={(item, searchText) => (
          <CustomAutocompleteItem
            key={item.id}
            title={item.title || ""}
            highlight={searchText}
            onPress={() => onSelectItem(item)}
          />
        )}
        onClear={() => {
          props.onChangeText?.("");
        }}
        onSelectItem={(item) => {
          props.onChangeText?.(item?.title || "");
        }}
        inputContainerStyle={[
          styles.input,
          ...propsStyle,
          {
            flexDirection: settings.get().isRTL ? "row-reverse" : "row",
          },
        ]}
        emptyResultText={translations.noCategories}
        textInputProps={{
          style: {
            textAlign: settings.get().isRTL ? "right" : "left",
            paddingHorizontal: 0,
          },
        }}
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={true}
        onFocus={(e) => {
          props.onFocus?.(e);
          shouldHandleKeyboardEvents.value = true;
        }}
        onBlur={(e) => {
          props.onBlur?.(e);
          shouldHandleKeyboardEvents.value = false;
        }}
        dataSet={filteredItems}
      />
      {props.error && (
        <Text
          style={[
            styles.error,
            {
              color: colors.danger,
            },
          ]}
        >
          {props.errorText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: typography.s,
    display: "flex",
    color: colors.secondary,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 8,
    backgroundColor: colors.foreground,
    fontSize: typography.m,
    paddingHorizontal: spacing.s,
  },
  error: {
    fontSize: typography.s,
    color: colors.danger,
  },
});
