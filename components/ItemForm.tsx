import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Item } from '@/models/item';
import { useEffect, useReducer, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useCamera } from './Camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

type fields = 'name' | 'category' | 'quantity' | 'missingThreshold' | 'camera';
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

  useEffect(() => {
    if (camera.uri) {
      setMediaSelection(false);
      dispatch({ type: 'updateImage', payload: camera.uri });
      saveLocalImage(camera.uri);
    }
  }, [camera.uri]);

  const onDeletePress = () => {
    if (onDelete) {
      onDelete(state);
    }
  };

  const saveLocalImage = async (uri: string) => {
    console.log(FileSystem.documentDirectory);
    if (FileSystem.documentDirectory) {
      const fileName = uri.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;
      try {
        await FileSystem.moveAsync({
          from: uri,
          to: newPath,
        });
        dispatch({ type: 'updateImage', payload: newPath });
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
      dispatch({ type: 'updateImage', payload: result.assets[0].uri });
      saveLocalImage(result.assets[0].uri);
    }
  };

  if (mediaSelection) {
    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 10,
            marginBottom: 20,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => camera.setOpen(true)}
        >
          <Text style={styles.buttonText}>צלם תמונה</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Text style={styles.buttonText}>בחר תמונה</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!hiddenFields.includes('name') && (
        <>
          <Text style={styles.label}>שם</Text>
          <TextInput
            style={styles.input}
            onEndEditing={(e) => {
              dispatch({ type: 'updateName', payload: e.nativeEvent.text });
            }}
            defaultValue={item.name}
          />
        </>
      )}
      {!hiddenFields.includes('category') && (
        <>
          <Text style={styles.label}>קטגוריה</Text>
          <TextInput
            style={styles.input}
            onEndEditing={(e) => {
              dispatch({ type: 'updateCategory', payload: e.nativeEvent.text });
            }}
            defaultValue={item.category}
          />
        </>
      )}
      {!hiddenFields.includes('quantity') && (
        <>
          <Text style={styles.label}>כמות</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            onEndEditing={(e) => {
              dispatch({ type: 'updateQuantity', payload: e.nativeEvent.text });
            }}
            defaultValue={item.quantity.toString()}
          />
        </>
      )}
      {!hiddenFields.includes('missingThreshold') && (
        <>
          <Text style={styles.label}>כמות לקנייה</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onEndEditing={(e) => {
              dispatch({
                type: 'updateMissingThreshold',
                payload: e.nativeEvent.text,
              });
            }}
            defaultValue={item.missingThreshold.toString()}
          />
        </>
      )}
      {!hiddenFields.includes('camera') && (
        <TouchableOpacity
          style={[
            styles.imageButton,
            {
              borderColor: theme.colors.border,
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
              blurRadius={2}
              contentFit="cover"
            />
          )}
          <Ionicons
            style={{
              color: theme.colors.border,
            }}
            size={40}
            name="camera-outline"
          />
        </TouchableOpacity>
      )}
      <View style={styles.buttons}>
        {deleteAble && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress}>
            <Text style={styles.buttonText}>מחק</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onSubmit(state)}
        >
          <Text style={styles.buttonText}>שמור</Text>
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
    width: '100%',
    position: 'absolute',
    borderRadius: 10,
  },
  imageButton: {
    borderRadius: 10,
    width: '100%',
    height: 75,
    marginBottom: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    fontSize: 18,
    textAlign: 'right',
  },
  buttons: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#26AE60',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#c63535',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

type Action = {
  type:
    | 'updateQuantity'
    | 'updateCategory'
    | 'updateMissingThreshold'
    | 'updateName'
    | 'updateImage';
  payload: string;
};

function reducer(state: Item, action: Action): Item {
  switch (action.type) {
    case 'updateQuantity':
      const quantity = parseFloat(action.payload);
      return { ...state, quantity: quantity >= 0 ? quantity : 0 };
    case 'updateCategory':
      return { ...state, category: action.payload };
    case 'updateMissingThreshold':
      const missingThreshold = parseFloat(action.payload);
      return {
        ...state,
        missingThreshold: missingThreshold >= 0 ? missingThreshold : 0,
      };
    case 'updateName':
      return { ...state, name: action.payload };
    case 'updateImage':
      return { ...state, image: action.payload };
    default:
      return state;
  }
}
