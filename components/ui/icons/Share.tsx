import { colors } from "@/utils/theme";
import * as React from "react";
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg";

interface Props extends SvgProps {
  variant?: "default" | "primary";
}
const ShareIcon = (props: Props) => {
  if (props.variant === "primary") {
    return (
      <Svg width={24} height={21} fill="none" {...props}>
        <G strokeLinecap="round" strokeLinejoin="round" clipPath="url(#a)">
          <Path
            fill={colors.foreground}
            stroke={colors.foreground}
            strokeWidth={2.105}
            d="M16.842 1.553h2.632a2.632 2.632 0 0 1 2.631 2.631v12.632a2.632 2.632 0 0 1-2.631 2.631H3.684a2.632 2.632 0 0 1-2.631-2.631V4.184a2.632 2.632 0 0 1 2.631-2.631h13.158Z"
          />
          <Path
            stroke={colors.primary}
            strokeWidth={1.579}
            d="m11.645 11.918 3.782 4.306 3.783-4.306m-3.783 3.708V4.776m-3.914 4.306L7.73 4.776 3.947 9.082M7.73 5.374v10.85"
          />
        </G>
        <Defs>
          <ClipPath id="a">
            <Path fill={colors.foreground} d="M0 .5h23.158v20H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    );
  }
  return (
    <Svg width={24} height={21} fill="none" {...props}>
      <G
        stroke={colors.foreground}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#a)"
      >
        <Path
          strokeWidth={2.105}
          d="M16.842 1.553h2.632a2.632 2.632 0 0 1 2.631 2.631v12.632a2.632 2.632 0 0 1-2.631 2.631H3.684a2.632 2.632 0 0 1-2.631-2.631V4.184a2.632 2.632 0 0 1 2.631-2.631h13.158Z"
        />
        <Path
          strokeWidth={1.579}
          d="m11.645 11.918 3.783 4.306 3.783-4.306m-3.783 3.708V4.776m-3.915 4.306L7.73 4.776 3.947 9.082M7.73 5.374v10.85"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={colors.foreground} d="M0 .5h23.158v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
export default ShareIcon;
