import { Ionicons } from '@expo/vector-icons';
import {
  useCameraPermissions,
  CameraView as ExpoCameraView,
} from 'expo-camera';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  BackHandler,
} from 'react-native';

type CameraStoreType = {
  setOpen: (open: boolean) => void;
  uri: string | undefined;
};

const CameraContext = React.createContext<CameraStoreType>({
  setOpen: (open: boolean) => {},
  uri: undefined,
});

interface CameraProviderProps {
  children: React.ReactNode;
}

export const useCamera = () => {
  const context = React.useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [uri, setUri] = React.useState<string | undefined>(undefined);
  const cameraRef = React.useRef<ExpoCameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (open) {
          setOpen(false);
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [open]);

  const onSave = () => {
    if (cameraRef.current) {
      cameraRef.current.takePictureAsync().then((photo) => {
        if (photo) {
          setUri(photo.uri);
          setOpen(false);
          requestAnimationFrame(() => {
            setUri(undefined);
          });
        }
      });
    }
  };

  const CameraView = () => {
    if (!open) return null;
    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <TouchableOpacity
          style={[styles.permissionDropShadow, StyleSheet.absoluteFill]}
          onPress={() => setOpen(false)}
        >
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>יש צורך באישור המצלמה</Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={(e) => {
                e.stopPropagation();
                requestPermission();
              }}
            >
              <Text style={styles.buttonText}>אשר מצלמה</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
    if (open) {
      return (
        <ExpoCameraView
          style={[styles.camera, StyleSheet.absoluteFill]}
          facing="back"
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onSave}>
              <Ionicons
                size={60}
                style={styles.cameraIcon}
                name="camera-outline"
              />
            </TouchableOpacity>
          </View>
        </ExpoCameraView>
      );
    }
  };

  return (
    <CameraContext.Provider value={{ setOpen, uri }}>
      {CameraView()}
      {children}
    </CameraContext.Provider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  camera: {
    zIndex: 100,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderRadius: 100,
    borderWidth: 5,
    backgroundColor: '#333',
    aspectRatio: 1,
    padding: 10,
    height: 100,
  },
  cameraIcon: {
    color: '#fff',
  },
  permissionDropShadow: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  permissionContainer: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },

  permissionButton: {
    backgroundColor: '#26AE60',
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
