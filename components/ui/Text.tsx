import { settings } from "@/utils/store";
import { observer } from "@legendapp/state/react";
import { useMemo } from "react";
import { Text as ReactText, TextProps } from "react-native";

export const Text = observer((props: TextProps) => {
  const propsStyle = useMemo(() => {
    return Array.isArray(props.style) ? props.style : [props.style];
  }, [props.style]);
  return (
    <ReactText
      {...props}
      style={[
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
