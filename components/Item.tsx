import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { observer } from '@legendapp/state/react';
import { Item } from '@/models/item';
import { useTheme } from '@/utils/theme';
import { usePopup } from './Popup';
import { Image } from 'expo-image';

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
    const theme = useTheme();

    const { setContent } = usePopup();

    const onImagePreview = (e: GestureResponderEvent) => {
      e.stopPropagation();
      setContent(
        <Image
          style={{
            flex: 1,
            marginBottom: 20,
          }}
          contentFit="fill"
          source={{ uri: item.image }}
        />,
      );
    };

    return (
      <View style={styles.item} key={item.id}>
        <TouchableOpacity
          onPress={() => {
            onItemPress(item);
          }}
          style={styles.editArea}
        >
          {item.image && (
            <TouchableOpacity onPress={onImagePreview}>
              <Ionicons
                style={{
                  color: theme.colors.secondaryBackground,
                }}
                size={30}
                name="image-outline"
              />
            </TouchableOpacity>
          )}
          <Text numberOfLines={1} style={styles.itemText}>
            {item.name}
          </Text>
        </TouchableOpacity>
        <View style={styles.itemControls}>
          {IncreaseQuantity && (
            <TouchableOpacity
              onPress={() => {
                IncreaseQuantity(item);
              }}
              style={styles.itemButton}
            >
              <Ionicons size={30} name="add" />
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
            <TouchableOpacity
              onPress={() => DecreaseQuantity(item)}
              style={styles.itemButton}
            >
              <Ionicons size={30} name="remove" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);
export default ItemComponent;
const styles = StyleSheet.create({
  item: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    height: 50,
  },
  itemButton: {
    padding: 10,
  },
  itemText: {
    fontSize: 24,
    textAlign: 'left',
  },
  editArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,
  },
  itemControls: {
    flexDirection: 'row',
    borderColor: '#f4f4f4',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderRadius: 15,
  },
  quantityInput: {
    fontSize: 20,
    height: 30,
    width: 30,
    textAlign: 'center',
  },
});
