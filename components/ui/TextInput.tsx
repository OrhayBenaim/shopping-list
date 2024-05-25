import { settings } from "@/utils/store";
import { observer } from "@legendapp/state/react";
import { useMemo } from "react";
import {
  TextInput as ReactTextInput,
  TextInputProps as TextInputReactProps,
  StyleSheet,
} from "react-native";
import { Text } from "./Text";

interface TextInputProps extends TextInputReactProps {
  label?: string;
}
export const TextInput = observer((props: TextInputProps) => {
  const propsStyle = useMemo(() => {
    return Array.isArray(props.style) ? props.style : [props.style];
  }, [props.style]);
  return (
    <>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
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
    </>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "bold",
    display: "flex",
  },
});
