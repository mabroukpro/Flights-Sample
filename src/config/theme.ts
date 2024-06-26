import { theme } from "antd";
import { ThemeConfig } from "antd/es/config-provider/context";

export type ThemeMode = "light" | "dark";

export function getThemeConfig(mode: ThemeMode = "light"): ThemeConfig {
  return {
    token: {
      colorPrimary: "#1890ff",
      fontFamily: "Roboto, sans-serif",
    },
    algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    components: {
      Menu: {
        darkItemBg:"#141414",
      },
    },
  };
}
