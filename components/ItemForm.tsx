import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Item } from "@/models/item";
import { useEffect, useReducer, useState } from "react";
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

type fields = "name" | "category" | "quantity" | "missingThreshold" | "camera";
interface Props {
  item: Item;
  onSubmit: (item: Item) => void;
  hiddenFields?: fields[];
  deleteAble?: boolean;
  onDelete?: (item: Item) => void;
}
const ItemForm = ({
  item,
  onSubmit,
  hiddenFields = [],
  onDelete,
  deleteAble = false,
}: Props) => {
  const [state, dispatch] = useReducer(reducer, item);
  const [mediaSelection, setMediaSelection] = useState(false);
  const camera = useCamera();
  const theme = useTheme();

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
      dispatch({ type: "updateImage", payload: camera.uri });
      saveLocalImage(camera.uri);
    }
  }, [camera.uri]);

  const onDeletePress = () => {
    if (onDelete) {
      onDelete(state);
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
        dispatch({ type: "updateImage", payload: newPath });
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
      dispatch({ type: "updateImage", payload: result.assets[0].uri });
      saveLocalImage(result.assets[0].uri);
    }
  };

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
          <Text style={[styles.buttonText, { color: theme.colors.lightText }]}>
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
          <Text style={[styles.buttonText, { color: theme.colors.lightText }]}>
            {translations.choosePicture}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onItemSubmit = (data: Item) => {
    onSubmit({
      ...data,
      name: data.name.trim(),
      category: data.category.trim(),
    });
  };

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
            <TextInput
              containerStyles={styles.containerInput}
              label={translations.category}
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
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.mainBackground,
                },
              ]}
              value={value.toString()}
              onChangeText={(e) => {
                const quantity = parseFloat(e);
                onChange(quantity >= 0 ? quantity : 0);
              }}
              onBlur={onBlur}
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
              label={translations.missingThreshold}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.mainBackground,
                },
              ]}
              keyboardType="numeric"
              value={value.toString()}
              onChangeText={(e) => {
                const quantity = parseFloat(e);
                onChange(quantity >= 0 ? quantity : 0);
              }}
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
              borderColor: theme.colors.primaryAction,
              backgroundColor: state.image
                ? "transparent"
                : theme.colors.mainBackground,
            },
          ]}
          onPress={() => {
            setMediaSelection(true);
          }}
        >
          {state.image && (
            <Image
              style={[styles.image, StyleSheet.absoluteFill]}
              source={{ uri: state.image }}
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
          <Text style={[styles.buttonText, { color: theme.colors.lightText }]}>
            {translations.save}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
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
    padding: 10,
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

function reducer(state: Item, action: Action): Item {
  switch (action.type) {
    case "updateQuantity":
      const quantity = parseFloat(action.payload);
      return { ...state, quantity: quantity >= 0 ? quantity : 0 };
    case "updateCategory":
      return { ...state, category: action.payload };
    case "updateMissingThreshold":
      const missingThreshold = parseFloat(action.payload);
      return {
        ...state,
        missingThreshold: missingThreshold >= 0 ? missingThreshold : 0,
      };
    case "updateName":
      return { ...state, name: action.payload };
    case "updateImage":
      return { ...state, image: action.payload };
    default:
      return state;
  }
}
