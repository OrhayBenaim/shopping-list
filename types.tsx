/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import type { Feather } from "@expo/vector-icons";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Root: NavigatorScreenParams<AuthParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export enum HomeStackScreen {
  HomeScreen = "HomeScreen",
  Product = "Product",
}

export type AuthParamList = {
  [HomeStackScreen.HomeScreen]: undefined;
  [HomeStackScreen.Product]: {
    product: ProductType;
  };
};

export type HomeStackScreenProps<Screen extends keyof AuthParamList> =
  NativeStackScreenProps<AuthParamList, Screen>;

export type IconName = keyof typeof Feather.glyphMap;

export interface CategoryType {
  id: number;
  name: string;
  icon?: IconName;
}

export enum Units {
  Gram,
  Kg,
  Piece,
}

export interface ProductType {
  id: number;
  name: string;
  category: CategoryType;
  image: string;
  unit: Units;
}
