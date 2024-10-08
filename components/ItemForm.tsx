import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Item } from "@/models/item";
import { useEffect, useMemo, useReducer, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useCamera } from "./Camera";
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
import { colors, spacing, typography } from "@/utils/theme";
import { useScreen } from "@/hooks/useScreen";
import { usePostHog } from "posthog-react-native";

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
    const screen = useScreen();
    const posthog = usePostHog();

    const [state, dispatch] = useReducer(reducer, item);
    const [mediaSelection, setMediaSelection] = useState(false);
    const camera = useCamera();
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
      defaultValues: { ...item },
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
      posthog.capture("Saved image", { screen });

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
      posthog.capture("Choose gallery", { screen });

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

    const onItemSubmit = (data: Item) => {
      onSubmit({
        ...data,
        image: state.image,
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
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => {
              posthog.capture("Choose camera", { screen });

              camera.setOpen(true);
            }}
          >
            <Text style={[styles.buttonText, { color: colors.foreground }]}>
              {translations.capturePicture}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={pickImage}
          >
            <Text style={[styles.buttonText, { color: colors.foreground }]}>
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
                style={styles.input}
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
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
        )}

        {!hiddenFields.includes("camera") && (
          <TouchableOpacity
            style={[
              styles.imageButton,
              {
                borderColor: colors.primary,
                backgroundColor: image ? "transparent" : colors.foreground,
              },
            ]}
            onPress={() => {
              posthog.capture("Opened media select", { screen });

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
                color: colors.primary,
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
          <TouchableOpacity
            style={[
              styles.addButton,
              isValid
                ? {
                    backgroundColor: colors.primary,
                  }
                : {
                    backgroundColor: colors.secondary,
                  },
            ]}
            disabled={!isValid}
            onPress={handleSubmit(onItemSubmit)}
          >
            <Text style={styles.buttonText}>{translations.save}</Text>
          </TouchableOpacity>
          {deleteAble && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDeletePress}
            >
              <Text style={styles.buttonText}>{translations.delete}</Text>
            </TouchableOpacity>
          )}
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
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 8,
    backgroundColor: colors.foreground,
    fontSize: typography.m,
    padding: spacing.s,
  },
  containerInput: {
    marginBottom: 20,
  },
  buttons: {
    gap: spacing.m,
  },
  addButton: {
    padding: spacing.s,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  deleteButton: {
    padding: spacing.s,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.danger,
  },
  buttonText: {
    fontSize: typography.l,
    fontWeight: "bold",
    color: colors.foreground,
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

function reducer(state: Item, action: Action): Item {
  switch (action.type) {
    case "updateCategory":
      return { ...state, category: action.payload };
    case "updateName":
      return { ...state, name: action.payload };
    case "updateImage":
      return { ...state, image: action.payload };
    default:
      return state;
  }
}
