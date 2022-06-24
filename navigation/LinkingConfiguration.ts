/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import type { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import type { RootStackParamList } from "../types";
import { HomeStackScreen } from "../types";

export const LinkingConfiguration: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          [HomeStackScreen.HomeScreen]: HomeStackScreen.HomeScreen,
        },
      },
    },
  },
};
