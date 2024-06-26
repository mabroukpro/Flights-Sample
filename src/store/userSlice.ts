import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userKey = "user";

interface UserState {
  name: string;
  email: string;
  token: string;
  refreshToken: string;
}

// We could use a library like redux-persist to handle this but it's a bit overkill for this project

// Attempt to retrieve user data from localStorage
const getUserFromLocalStorage = (): UserState | null => {
  const userString = localStorage.getItem(userKey);
  if (userString) {
    try {
      const user = JSON.parse(userString);
      return {
        name: user.name || "",
        email: user.email || "",
        token: user.token || "",
        refreshToken: user.refreshToken || "",
      };
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }
  return null;
};

// Initialize state based on localStorage or default values
const initialState: UserState = getUserFromLocalStorage() || {
  name: "",
  email: "",
  token: "",
  refreshToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      // Update state immutably
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;

      // Update localStorage
      if (action.payload.token && action.payload.refreshToken) {
        localStorage.setItem(userKey, JSON.stringify(action.payload));
      } else {
        localStorage.removeItem(userKey);
      }
    },
    clearUser: (state) => {
      // Reset state
      state.name = "";
      state.email = "";
      state.token = "";
      state.refreshToken = "";

      // Clear localStorage
      localStorage.removeItem(userKey);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
