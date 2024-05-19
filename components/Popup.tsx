import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

type PopupStoreType = {
  setOpen: (open: boolean) => void;
  setContent: (content: React.ReactNode, snapPoint?: string) => void;
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
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

const DEFAULT_SNAP_POINT = '75%';
export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [snapPoints, setSnapPoints] = React.useState([DEFAULT_SNAP_POINT]);
  const [content, _setContent] = React.useState<React.ReactNode>(undefined);
  // ref
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const onSetContent = (c: ReactNode, snapPoint?: string) => {
    _setContent(c);
    if (snapPoint) {
      setSnapPoints([snapPoint]);
    } else {
      setSnapPoints([DEFAULT_SNAP_POINT]);
    }

    bottomSheetModalRef.current?.present();
  };
  const setOpen = (open: boolean) => {
    if (open) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  };

  return (
    <PopupContext.Provider value={{ setOpen, setContent: onSetContent }}>
      <BottomSheetModalProvider>
        {children}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
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
    width: '100%',
    padding: 20,
  },
});
