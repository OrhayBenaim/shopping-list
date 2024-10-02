import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { observer } from "@legendapp/state/react";
import { Item } from "@/models/item";
import { usePopup } from "./Popup";
import { Text } from "@/components/ui/Text";
import { settings } from "@/utils/store";
import { useMemo } from "react";
import * as FileSystem from "expo-file-system";
import { BlurImageProps } from "./Image";
import { colors, spacing, typography } from "@/utils/theme";
import { useScreen } from "@/hooks/useScreen";
import { usePostHog } from "posthog-react-native";

interface Props {
  item: Item;
  onToggleMissing?: (item: Item) => void;
  onItemPress?: (item: Item) => void;
}
const ItemComponent = observer(
  ({ item, onItemPress, onToggleMissing }: Props) => {
    const { setContent } = usePopup();
    const screen = useScreen();
    const posthog = usePostHog();

    const image = useMemo(() => {
      if (FileSystem.documentDirectory && item.image) {
        return FileSystem.documentDirectory + item.image;
      }
    }, [item.image]);

    const onImagePreview = (e: GestureResponderEvent) => {
      posthog.capture("Image preview", { screen });

      e.stopPropagation();
      setContent(
        <BlurImageProps
          style={{
            flex: 1,
            marginBottom: 20,
          }}
          contentFit="fill"
          uri={image}
          blurhash={item.blurHash}
        />
      );
    };

    const onToggleMissingItem = () => {
      if (!onToggleMissing) return;
      onToggleMissing({
        ...item,
        missing: !item.missing,
      });
    };

    const onPressItem = () => {
      if (!onItemPress) return;
      posthog.capture("Item pressed", { screen });

      onItemPress(item);
    };

    const hasControls = useMemo(() => !!onToggleMissing, [onToggleMissing]);

    return (
      <View
        style={[
          styles.item,
          {
            flexDirection: settings.get().isRTL ? "row-reverse" : "row",
          },
        ]}
        key={item.id}
      >
        <TouchableOpacity
          onPress={onPressItem}
          disabled={!onItemPress}
          style={[
            styles.editArea,
            {
              flexDirection: settings.get().isRTL ? "row-reverse" : "row",
            },
          ]}
        >
          {image && (
            <TouchableOpacity onPress={onImagePreview}>
              <Ionicons
                style={{
                  color: colors.text,
                }}
                size={20}
                name="image-outline"
              />
            </TouchableOpacity>
          )}
          <Text numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
        {hasControls && (
          <TouchableOpacity onPress={onToggleMissingItem}>
            <Ionicons
              style={{
                color: item.missing ? colors.danger : colors.secondary,
              }}
              size={typography.xxl}
              name={
                item.missing
                  ? "close-circle-outline"
                  : "checkmark-circle-outline"
              }
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);
export default ItemComponent;
const styles = StyleSheet.create({
  item: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.s,
  },

  editArea: {
    flex: 1,
    alignItems: "center",
    gap: spacing.s,
  },

  quantityInput: {
    fontSize: typography.s,
    textAlign: "center",
  },
});
