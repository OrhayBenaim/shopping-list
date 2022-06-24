import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../screens/HomeScreen";
import type { RootStackParamList, AuthParamList } from "../types";
import { HomeStackScreen } from "../types";

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
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const HomeNavigation = createNativeStackNavigator<AuthParamList>();

function BottomTabNavigator() {
  return (
    <HomeNavigation.Navigator initialRouteName={HomeStackScreen.HomeScreen}>
      <HomeNavigation.Screen
        name={HomeStackScreen.HomeScreen}
        component={HomeScreen}
      />
    </HomeNavigation.Navigator>
  );
}
