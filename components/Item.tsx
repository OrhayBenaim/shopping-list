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
import { TextInput } from "@/components/ui/TextInput";
import { useMemo } from "react";
import * as FileSystem from "expo-file-system";
import { BlurImageProps } from "./Image";
import { colors, spacing, typography } from "@/utils/theme";

interface Props {
  item: Item;
  IncreaseQuantity?: (item: Item) => void;
  DecreaseQuantity?: (item: Item) => void;
  ChangeQuantity?: (item: Item, quantity: string) => void;
  onItemPress: (item: Item) => void;
}
const ItemComponent = observer(
  ({
    item,
    onItemPress,
    IncreaseQuantity,
    DecreaseQuantity,
    ChangeQuantity,
  }: Props) => {
    const { setContent } = usePopup();

    const image = useMemo(() => {
      if (FileSystem.documentDirectory && item.image) {
        return FileSystem.documentDirectory + item.image;
      }
    }, [item.image]);

    const onImagePreview = (e: GestureResponderEvent) => {
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

    const hasControls = useMemo(
      () => !!IncreaseQuantity || !!DecreaseQuantity || !!ChangeQuantity,
      [IncreaseQuantity, DecreaseQuantity, ChangeQuantity]
    );

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
          onPress={() => {
            onItemPress(item);
          }}
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
          <View style={styles.itemControls}>
            {IncreaseQuantity && (
              <TouchableOpacity
                onPress={() => {
                  IncreaseQuantity(item);
                }}
              >
                <Ionicons size={20} name="add" />
              </TouchableOpacity>
            )}
            {ChangeQuantity && (
              <TextInput
                onEndEditing={(e) => ChangeQuantity(item, e.nativeEvent.text)}
                keyboardType="numeric"
                style={styles.quantityInput}
                defaultValue={item.quantity.toString()}
              />
            )}
            {DecreaseQuantity && (
              <TouchableOpacity onPress={() => DecreaseQuantity(item)}>
                <Ionicons size={20} name="remove" />
              </TouchableOpacity>
            )}
          </View>
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
  itemControls: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.s,
    paddingVertical: spacing.s / 2,
    paddingHorizontal: spacing.s,
    borderWidth: 1,
    borderRadius: 9999,
    borderColor: colors.text,
    width: 120,
  },
  quantityInput: {
    fontSize: typography.s,
    textAlign: "center",
  },
});
