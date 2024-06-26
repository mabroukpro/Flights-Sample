import React from "react";
import { Layout } from "antd";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Outlet } from "react-router-dom";

const LoggedOutLayout: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.layout.themeMode);
  return (
    <Layout>
      <Layout.Content
        className={classNames(
          themeMode === "light" ? "tw-bg-white" : "tw-bg-[#141414]"
        )}
      >
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default LoggedOutLayout;
