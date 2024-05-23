import { useMemo } from "react";
import {
  Text as ReactText,
  TextProps,
  StyleSheet,
  I18nManager,
} from "react-native";

export const Text = (props: TextProps) => {
  const propsStyle = useMemo(() => {
    return Array.isArray(props.style) ? props.style : [props.style];
  }, [props.style]);
  return (
    <ReactText {...props} style={[styles.text, ...propsStyle]}>
      {props.children}
    </ReactText>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
});
