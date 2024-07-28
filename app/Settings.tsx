import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { observer } from "@legendapp/state/react";
import { Text } from "@/components/ui/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { SetEndpoint, SetLanguage, SetSync, settings } from "@/utils/store";
import { translations } from "@/utils/translations";
import * as Application from "expo-application";
import { TextInput } from "@/components/ui/TextInput";
import { useTheme } from "@/utils/theme";
import { Controller, useForm } from "react-hook-form";
import { EndpointForm } from "@/models/settings";

const WIDTH = Dimensions.get("window").width;

const Settings = observer(() => {
  const navigation = useNavigation();
  const theme = useTheme();

  const _settings = settings.get();

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
    defaultValues: { endpoint: _settings.endpoint },
  });

  const onSave = (data: EndpointForm) => {
    if (!data.endpoint) return;
    SetEndpoint(data.endpoint);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
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
            selectedValue={_settings.language}
            onValueChange={(itemValue) => SetLanguage(itemValue)}
          >
            <Picker.Item label={translations.english} value="en" />
            <Picker.Item label={translations.hebrew} value="he" />
          </Picker>

          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => SetSync(value)}
            value={_settings.sync}
          />

          {_settings.sync && (
            <View>
              <Controller
                control={control}
                name="endpoint"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    containerStyles={styles.containerInput}
                    autoCapitalize="none"
                    label={translations.endpoint}
                    style={[styles.input]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isValid
                    ? {
                        backgroundColor: theme.colors.primaryAction,
                      }
                    : {
                        backgroundColor: theme.colors.disable,
                      },
                ]}
                disabled={!isValid}
                onPress={handleSubmit(onSave)}
              >
                <Text
                  style={[styles.buttonText, { color: theme.colors.lightText }]}
                >
                  {translations.save}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <Text style={styles.version}>
        V{Application.nativeApplicationVersion}
      </Text>
    </View>
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
  containerInput: {
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    fontSize: 18,
  },
  saveButton: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  version: {
    alignSelf: "flex-end",
    padding: 10,
  },
});
