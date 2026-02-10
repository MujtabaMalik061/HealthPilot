import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import Offline from "../components/Offline";
import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { isOnline } = useAuth();

  return (
    <>
      {isOnline ? (
        <div className="app-wrap">
          <SideBar />
          <div className="main-content">
            {/* <TopBar /> */}
            <Outlet />
          </div>
        </div>
      ) : (
        <Offline />
      )}
    </>
  );
};

export default AppLayout;
