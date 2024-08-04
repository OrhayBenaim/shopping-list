import { settings } from "@/utils/store";
import { colors, typography } from "@/utils/theme";
import { observer } from "@legendapp/state/react";
import { useMemo } from "react";
import { Text as ReactText, TextProps, StyleSheet } from "react-native";

interface Props extends TextProps {
  variant?: "default" | "sm" | "l" | "xl";
}
export const Text = observer((props: Props) => {
  const variant = props.variant || "default";
  const propsStyle = useMemo(() => {
    return Array.isArray(props.style) ? props.style : [props.style];
  }, [props.style]);
  return (
    <ReactText
      {...props}
      style={[
        styles.default,
        styles[variant],
        {
          textAlign: settings.get().isRTL ? "right" : "left",
        },
        ...propsStyle,
      ]}
    >
      {props.children}
    </ReactText>
  );
});

const styles = StyleSheet.create({
  default: {
    fontSize: typography.m,
    color: colors.text,
  },
  sm: {
    fontSize: typography.s,
    color: colors.secondary,
  },
  l: {
    fontSize: typography.l,
    color: colors.secondary,
  },
  xl: {
    fontSize: typography.xl,
    color: colors.text,
  },
});
