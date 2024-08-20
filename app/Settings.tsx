import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { observer } from "@legendapp/state/react";
import { Text } from "@/components/ui/Text";
import RNPickerSelect from "react-native-picker-select";
import {
  Lang,
  SetAuthorization,
  SetEndpoint,
  SetLanguage,
  SetSync,
  settings,
} from "@/utils/store";
import { translations } from "@/utils/translations";
import * as Application from "expo-application";
import { TextInput } from "@/components/ui/TextInput";
import { Controller, useForm } from "react-hook-form";
import { EndpointForm } from "@/models/settings";
import { colors, spacing, typography } from "@/utils/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

const Settings = observer(() => {
  const _settings = settings.get();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resetOptions: {
      keepDirty: true,
      keepTouched: true,
      keepDirtyValues: true,
    },
    defaultValues: {
      endpoint: _settings.endpoint,
      authorization: _settings.authorization,
    },
  });

  const onSave = (data: EndpointForm) => {
    if (!data.endpoint) return;
    SetEndpoint(data.endpoint);
    SetAuthorization(data.authorization);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <ScrollView style={styles.container}>
        <View style={styles.group}>
          <Text style={styles.label}>{translations.language}</Text>
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              iconContainer: {
                top: 15,
                right: !_settings.isRTL ? spacing.m : undefined,
                left: _settings.isRTL ? spacing.m : undefined,
              },
            }}
            Icon={() => (
              <Ionicons
                size={20}
                color={colors.secondary}
                name="chevron-down-outline"
              />
            )}
            value={_settings.language}
            placeholder={{}}
            onValueChange={(value: Lang) => SetLanguage(value)}
            items={[
              { label: translations.english, value: "en" },
              { label: translations.hebrew, value: "he" },
            ]}
          />
        </View>

        <View style={styles.syncContainer}>
          <View
            style={[
              styles.switch,
              {
                flexDirection: _settings.isRTL ? "row-reverse" : "row",
              },
            ]}
          >
            <TouchableOpacity onPress={() => SetSync(!_settings.sync)}>
              <Text style={styles.label}>{translations.enableSync}</Text>
            </TouchableOpacity>

            <Switch
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => SetSync(value)}
              value={_settings.sync}
            />
          </View>

          {_settings.sync && (
            <View style={styles.syncContainer}>
              <Controller
                control={control}
                name="endpoint"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    autoCapitalize="none"
                    label={translations.endpoint}
                    value={value}
                    style={styles.input}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />

              <Controller
                control={control}
                name="authorization"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    autoCapitalize="none"
                    label={translations.authorization}
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    onBlur={onBlur}
                  />
                )}
              />
              <TouchableOpacity
                style={[styles.saveButton]}
                disabled={!isValid}
                onPress={handleSubmit(onSave)}
              >
                <Text style={[styles.buttonText]}>{translations.save}</Text>
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
  switch: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  group: {
    marginBottom: 20,
  },
  containerInput: {
    marginBottom: 20,
  },
  syncContainer: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.m,
  },
  label: {
    fontSize: typography.s,
    display: "flex",
    color: colors.secondary,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 8,
    backgroundColor: colors.foreground,
    fontSize: typography.m,
    paddingHorizontal: spacing.s,
    height: 45,
    color: colors.text,
  },
  saveButton: {
    padding: spacing.s,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: typography.l,
    fontWeight: "bold",
    color: colors.foreground,
  },
  version: {
    alignSelf: "flex-end",
    padding: 10,
  },
});
