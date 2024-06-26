import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Dropdown, Switch, MenuProps } from "antd";
import { AirplaneTilt, Moon, Sun, UserCircle } from "@phosphor-icons/react";
import classNames from "classnames";
import { RootState } from "../store/store";
import { toggleTheme } from "../store/layoutSlice";
import { clearUser } from "../store/userSlice";

const LoggedInLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.layout.themeMode);
  const userName = useSelector((state: RootState) => state.user.name);

  const dropdownItems: MenuProps["items"] = [
    {
      key: "4",
      danger: true,
      label: "Logout",
      onClick: () => {
        dispatch(clearUser());
        navigate("/login");
      },
    },
  ];

  return (
    <Layout>
      <Layout.Header
        className={classNames(
          "tw-z-50 tw-p-0 tw-flex tw-justify-between tw-border-b tw-border-b-[#313131]",
          themeMode === "light" ? "tw-bg-white" : "tw-bg-[#141414]"
        )}
      >
        <div className={"tw-flex tw-items-center tw-gap-2 tw-px-4"}>
          <AirplaneTilt size={30} />
          <div className="tw-text-xl">Musala Flights</div>
        </div>
        <div className="tw-px-4 tw-flex tw-items-center tw-gap-2">
          <div className="tw-px-4 tw-flex tw-items-center tw-gap-2">
            <Sun size={24} />
            <Switch
              checked={themeMode === "dark"}
              onChange={() => dispatch(toggleTheme())}
            />
            <Moon size={24} />
          </div>
          <div className="tw-flex tw-items-center tw-gap-4">
            <div>{userName}</div>
            <Dropdown trigger={["click"]} menu={{ items: dropdownItems }}>
              <UserCircle className="tw-cursor-pointer" size={28} />
            </Dropdown>
          </div>
        </div>
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default LoggedInLayout;
