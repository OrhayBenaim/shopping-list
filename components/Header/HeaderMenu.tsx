import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export function HeaderMenu() {
  return (
    <TouchableOpacity>
      <Feather name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
}
