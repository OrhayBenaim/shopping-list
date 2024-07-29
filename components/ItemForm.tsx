import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FormItem, Item, MAX_QUANTITY } from "@/models/item";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme";
import { useCamera } from "./Camera";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Text } from "@/components/ui/Text";
import { TextInput } from "@/components/ui/TextInput";
import { useForm, Controller } from "react-hook-form";
import { translations } from "@/utils/translations";
import { useLatch } from "@/hooks/useLatch";
import { capitalize, clamp, safeParseFloat } from "@/utils/helpers";
import { AutoComplete } from "./ui/Autocomplete";
import { observer } from "@legendapp/state/react";
import { GetCategories } from "@/utils/store";
import { BlurImageProps } from "./Image";

const IGNORED_QUANTITY_KEYS = /[-, ]/;
type fields = "name" | "category" | "quantity" | "missingThreshold" | "camera";
interface Props {
  item: Item;
  onSubmit: (item: Item) => void;
  hiddenFields?: fields[];
  deleteAble?: boolean;
  onDelete?: (itemId: string) => void;
}
const ItemForm = observer(
  ({
    item,
    onSubmit,
    hiddenFields = [],
    onDelete,
    deleteAble = false,
  }: Props) => {
    const formItem = useMemo(
      () => ({
        ...item,
        quantity: item.quantity.toString(),
        missingThreshold: item.missingThreshold.toString(),
      }),
      [item]
    );
    const [state, dispatch] = useReducer(reducer, formItem);
    const [mediaSelection, setMediaSelection] = useState(false);
    const camera = useCamera();
    const theme = useTheme();
    const categories = GetCategories();

    const {
      control,
      handleSubmit,
      formState: { isValid, isDirty },
    } = useForm({
      resetOptions: {
        keepDirty: true,
        keepTouched: true,
        keepDirtyValues: true,
      },
      defaultValues: { ...formItem },
    });

    const latchedDirty = useLatch(isDirty, true);

    useEffect(() => {
      if (camera.uri) {
        setMediaSelection(false);
        // dispatch({ type: "updateImage", payload: camera.uri });
        saveLocalImage(camera.uri);
      }
    }, [camera.uri]);

    const onDeletePress = () => {
      if (onDelete) {
        onDelete(state.id);
      }
    };

    const saveLocalImage = async (uri: string) => {
      if (FileSystem.documentDirectory) {
        const fileName = uri.split("/").pop();
        const newPath = FileSystem.documentDirectory + fileName;
        try {
          await FileSystem.moveAsync({
            from: uri,
            to: newPath,
          });
          dispatch({ type: "updateImage", payload: fileName! });
        } catch (error) {
          throw error;
        }
      }
    };
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setMediaSelection(false);
        saveLocalImage(result.assets[0].uri);
      }
    };

    const onItemSubmit = (data: FormItem) => {
      onSubmit({
        ...data,
        image: state.image,
        quantity: safeParseFloat(data.quantity),
        missingThreshold: safeParseFloat(data.missingThreshold),
        name: data.name.trim(),
        category: capitalize(data.category.toLocaleLowerCase().trim()),
      });
    };

    const image = useMemo(() => {
      if (FileSystem.documentDirectory && state.image) {
        return FileSystem.documentDirectory + state.image;
      }
    }, [state.image]);

    if (mediaSelection) {
      return (
        <View
          style={[
            styles.container,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 10,
              marginBottom: 20,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: theme.colors.primaryAction,
              },
            ]}
            onPress={() => camera.setOpen(true)}
          >
            <Text
              style={[styles.buttonText, { color: theme.colors.lightText }]}
            >
              {translations.capturePicture}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: theme.colors.primaryAction,
              },
            ]}
            onPress={pickImage}
          >
            <Text
              style={[styles.buttonText, { color: theme.colors.lightText }]}
            >
              {translations.choosePicture}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {!hiddenFields.includes("name") && (
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                containerStyles={styles.containerInput}
                autoCapitalize="sentences"
                bottomSheet
                label={translations.name}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.mainBackground,
                  },
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={value.length === 0 && latchedDirty}
                errorText={translations.requiredField}
              />
            )}
          />
        )}
        {!hiddenFields.includes("category") && (
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <AutoComplete
                options={categories.map((category) => ({
                  id: category,
                  title: category,
                }))}
                containerStyles={styles.containerInput}
                label={translations.category}
                autoCapitalize="sentences"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.mainBackground,
                  },
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        )}
        {!hiddenFields.includes("quantity") && (
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                containerStyles={styles.containerInput}
                label={translations.quantity}
                keyboardType="numeric"
                bottomSheet
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.mainBackground,
                  },
                ]}
                value={value}
                onChangeText={(value) => {
                  if (IGNORED_QUANTITY_KEYS.test(value)) return;
                  onChange(value);
                }}
                onBlur={() => {
                  onChange(
                    clamp(safeParseFloat(value), 0, MAX_QUANTITY).toString()
                  );
                  onBlur();
                }}
              />
            )}
          />
        )}
        {!hiddenFields.includes("missingThreshold") && (
          <Controller
            control={control}
            name="missingThreshold"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                containerStyles={styles.containerInput}
                bottomSheet
                label={translations.missingThreshold}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.mainBackground,
                  },
                ]}
                keyboardType="numeric"
                value={value}
                onChangeText={(value) => {
                  if (IGNORED_QUANTITY_KEYS.test(value)) return;
                  onChange(value);
                }}
                onBlur={() => {
                  onChange(
                    clamp(safeParseFloat(value), 0, MAX_QUANTITY).toString()
                  );
                  onBlur();
                }}
              />
            )}
          />
        )}
        {!hiddenFields.includes("camera") && (
          <TouchableOpacity
            style={[
              styles.imageButton,
              {
                borderColor: theme.colors.primaryAction,
                backgroundColor: image
                  ? "transparent"
                  : theme.colors.mainBackground,
              },
            ]}
            onPress={() => {
              setMediaSelection(true);
            }}
          >
            {image && (
              <BlurImageProps
                style={[styles.image, StyleSheet.absoluteFill]}
                uri={image}
                blurhash={item.blurHash}
                blurRadius={5}
                contentFit="cover"
              />
            )}
            <Ionicons
              style={{
                color: theme.colors.primaryAction,
              }}
              size={40}
              name="camera-outline"
            />
          </TouchableOpacity>
        )}
        <View
          style={[
            styles.buttons,
            {
              flexDirection: "row",
            },
          ]}
        >
          {deleteAble && (
            <TouchableOpacity
              style={[
                styles.deleteButton,
                {
                  backgroundColor: theme.colors.dangerAction,
                },
              ]}
              onPress={onDeletePress}
            >
              <Text
                style={[styles.buttonText, { color: theme.colors.lightText }]}
              >
                {translations.delete}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.addButton,
              isValid
                ? {
                    backgroundColor: theme.colors.primaryAction,
                  }
                : {
                    backgroundColor: theme.colors.disable,
                  },
            ]}
            disabled={!isValid}
            onPress={handleSubmit(onItemSubmit)}
          >
            <Text
              style={[styles.buttonText, { color: theme.colors.lightText }]}
            >
              {translations.save}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);
export default ItemForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    position: "absolute",
    borderRadius: 10,
  },
  imageButton: {
    borderRadius: 10,
    width: "100%",
    height: 75,
    marginBottom: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  input: {
    width: "100%",
    height: 45,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  containerInput: {
    marginBottom: 20,
  },
  buttons: {
    gap: 10,
  },
  addButton: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

type Action = {
  type:
    | "updateQuantity"
    | "updateCategory"
    | "updateMissingThreshold"
    | "updateName"
    | "updateImage";
  payload: string;
};

function reducer(state: FormItem, action: Action): FormItem {
  switch (action.type) {
    case "updateQuantity":
      return { ...state, quantity: action.payload };
    case "updateCategory":
      return { ...state, category: action.payload };
    case "updateMissingThreshold":
      return {
        ...state,
        missingThreshold: action.payload,
      };
    case "updateName":
      return { ...state, name: action.payload };
    case "updateImage":
      return { ...state, image: action.payload };
    default:
      return state;
  }
}
