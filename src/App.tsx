import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider, message } from "antd";
import { ThemeMode, getThemeConfig } from "./config/theme";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "./store/store";
import { router } from "./router";

import "./App.scss";
import { setThemeMode } from "./store/layoutSlice";

function Root() {
  const themeMode = useSelector((state: RootState) => state.layout.themeMode);
  const [_, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    dispatch(setThemeMode(savedTheme as ThemeMode));
    document.body.className = savedTheme; // Set initial class
  }, [dispatch]);
  return (
    <ConfigProvider theme={getThemeConfig(themeMode)}>
      <div className="App">
        {contextHolder}
        <RouterProvider router={router} />
      </div>
    </ConfigProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

export default App;
