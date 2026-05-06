import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../ui/MobileNavbar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">

      {/* 💻 Desktop Sidebar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* 📱 Main Content Area */}
      <div className="flex-1 flex flex-col">

        {/* 📱 Mobile Top Navbar */}
        <div className="md:hidden sticky top-0 z-50 bg-white shadow">
          <MobileNavbar />
        </div>

        {/* 📄 Page Content */}
        <div className="flex-1 p-4 pb-20 md:pb-4">
          <Outlet />
        </div>

        {/* 📱 Mobile Bottom Navbar */}
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white shadow">
          <MobileNavbar />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;