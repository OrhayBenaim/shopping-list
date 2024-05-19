import { useTheme } from '@/utils/theme';
import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Nav } from '@/components/Nav';

export default function AppLayout() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.layout,
        {
          backgroundColor: theme.colors.mainBackground,
        },
      ]}
    >
      <Slot />
      <Nav />
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
