import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { observer } from "@legendapp/state/react";
import { Text } from "@/components/ui/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { SetLanguage, settings } from "@/utils/store";
import { translations } from "@/utils/translations";
const WIDTH = Dimensions.get("window").width;

const Settings = observer(() => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Ionicons size={30} name="menu-outline" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{translations.settings}</Text>
        <Ionicons
          size={30}
          name="menu-outline"
          style={{ color: "transparent" }}
        />
      </View>

      <View>
        <Picker
          selectedValue={settings.get().language}
          onValueChange={(itemValue) => SetLanguage(itemValue)}
        >
          <Picker.Item label={translations.english} value="en" />
          <Picker.Item label={translations.hebrew} value="he" />
        </Picker>
      </View>
    </ScrollView>
  );
});

export default Settings;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    width: WIDTH,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: "auto",
  },
});
