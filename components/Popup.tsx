import React, { ReactNode, useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { colors } from "@/utils/theme";

type PopupStoreType = {
  setOpen: (open: boolean) => void;
  setContent: (content: React.ReactNode, snapPoint?: string | string[]) => void;
};

const PopupContext = React.createContext<PopupStoreType>({
  setOpen: (open: boolean) => {},
  setContent: (_) => {},
});

interface PopupProviderProps {
  children: React.ReactNode;
}

export const usePopup = () => {
  const context = React.useContext(PopupContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};

const DEFAULT_SNAP_POINT = "75%";
export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [snapPoints, setSnapPoints] = React.useState([DEFAULT_SNAP_POINT]);
  const [content, _setContent] = React.useState<React.ReactNode>(undefined);
  const [open, setPopupOpen] = React.useState(false);
  // ref
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const setOpen = (open: boolean) => {
    setPopupOpen(open);
    if (open) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  };

  const onSetContent = (c: ReactNode, snapPoint?: string | string[]) => {
    _setContent(c);
    if (snapPoint) {
      setSnapPoints(Array.isArray(snapPoint) ? snapPoint : [snapPoint]);
    } else {
      setSnapPoints([DEFAULT_SNAP_POINT]);
    }

    setOpen(true);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (open) {
          setOpen(false);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [open]);

  return (
    <PopupContext.Provider value={{ setOpen, setContent: onSetContent }}>
      <BottomSheetModalProvider>
        {children}

        <BottomSheetModal
          keyboardBlurBehavior="restore"
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          style={{
            backgroundColor: "rgba(255, 255, 255,0)", // <==== HERE
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,

            elevation: 24,
          }}
          backgroundStyle={{
            backgroundColor: colors.foreground,
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
            {content}
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </PopupContext.Provider>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
});
