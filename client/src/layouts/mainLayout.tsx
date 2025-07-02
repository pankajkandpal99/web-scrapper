import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";
import { NAVBAR_ITEMS } from "../config/constants";

interface MainLayoutProps {
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  // fullWidth = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar items={NAVBAR_ITEMS} />
      <main className="flex-1">
        <div
          className={`container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pb-12 mt-8`}
        >
          {/* <AnimatedBackground /> */}
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
