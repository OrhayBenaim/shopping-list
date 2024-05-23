import { settings } from "@/utils/store";
import { observer } from "@legendapp/state/react";
import { useMemo } from "react";
import { TextInput as ReactTextInput, TextInputProps } from "react-native";

export const TextInput = observer((props: TextInputProps) => {
  const propsStyle = useMemo(() => {
    return Array.isArray(props.style) ? props.style : [props.style];
  }, [props.style]);
  return (
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
  );
});
