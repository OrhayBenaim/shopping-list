import { settings } from "@/utils/store";
import { observer } from "@legendapp/state/react";
import { useMemo } from "react";
import {
  TextInput as ReactTextInput,
  TextInputProps as TextInputReactProps,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import { colors } from "@/utils/theme";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

interface TextInputProps extends TextInputReactProps {
  label?: string;
  error?: boolean;
  placeholder?: string;
  errorText?: string;
  containerStyles?: StyleProp<ViewStyle>;
  bottomSheet?: boolean;
}
export const TextInput = observer((props: TextInputProps) => {
  const propsStyle = useMemo(() => {
    return Array.isArray(props.style) ? props.style : [props.style];
  }, [props.style]);

  const containerStyles = useMemo(() => {
    return Array.isArray(props.containerStyles)
      ? props.containerStyles
      : [props.containerStyles];
  }, [props.containerStyles]);

  return (
    <View style={containerStyles}>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      {props.bottomSheet ? (
        <BottomSheetTextInput
          {...props}
          style={[
            {
              textAlign: settings.get().isRTL ? "right" : "left",
            },
            ...propsStyle,
          ]}
        >
          {props.children}
        </BottomSheetTextInput>
      ) : (
        <ReactTextInput
          {...props}
          style={[
            {
              textAlign: settings.get().isRTL ? "right" : "left",
            },
            ...propsStyle,
          ]}
        >
          {props.children}
        </ReactTextInput>
      )}

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
    fontSize: 18,
    fontWeight: "bold",
    display: "flex",
  },
  error: {
    fontSize: 14,
  },
});
