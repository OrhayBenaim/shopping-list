import { usePathname } from "expo-router";
import { useMemo } from "react";

export const useScreen = () => {
  const pathname = usePathname();
  return useMemo(
    () =>
      pathname === "/"
        ? "Home"
        : pathname === "/Missing"
        ? "Missing"
        : pathname === "/Share"
        ? "Share"
        : pathname === "/Settings"
        ? "Settings"
        : "Intro",
    [pathname]
  );
};
