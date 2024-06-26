import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface LayoutState {
  themeMode: ThemeMode;
}

const initialState: LayoutState = {
  themeMode: (localStorage.getItem("theme") as ThemeMode) || "light",
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.themeMode === "light" ? "dark" : "light";
      state.themeMode = newTheme;
      localStorage.setItem("theme", newTheme);
      document.body.className = newTheme;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      localStorage.setItem("theme", action.payload);
      document.body.className = action.payload;
    },
  },
});

export const { toggleTheme, setThemeMode } = layoutSlice.actions;

export default layoutSlice.reducer;
