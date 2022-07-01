import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import { HomeScreen } from "../screens/HomeScreen";
import type { RootStackParamList, AuthParamList } from "../types";
import { Units, HomeStackScreen } from "../types";
import { Header } from "../components/Header";
import { Product } from "../screens/Product";

import { LinkingConfiguration } from "./LinkingConfiguration";

export function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={AuthStackNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const { Navigator, Screen } =
  createSharedElementStackNavigator<AuthParamList>();

function AuthStackNavigator() {
  return (
    <Navigator initialRouteName={HomeStackScreen.HomeScreen}>
      <Screen
        name={HomeStackScreen.HomeScreen}
        component={HomeScreen}
        options={{
          header: () => (
            <Header leftIcon="menu" title="Home" rightIcon="search" />
          ),
        }}
      />
      <Screen
        name={HomeStackScreen.Product}
        component={Product}
        initialParams={{
          product: {
            id: -1,
            image: "",
            name: "",
            unit: Units.Gram,
            category: { id: -1, name: "" },
          },
        }}
        options={{
          header: ({ navigation }) => (
            <Header
              onLeftIconPress={() => navigation.goBack()}
              leftIcon="arrow-left"
              title=""
            />
          ),
        }}
      />
    </Navigator>
  );
}
