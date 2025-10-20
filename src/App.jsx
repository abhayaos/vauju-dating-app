import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";

// Pages
import Home from "./pages/Home";
import Register from "./AUTH/Register";
import Login from "./AUTH/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import Matches from "./pages/Matches";
import Admin from "./Admin/Admin";
import AdminLogin from "./Admin/Auth/Login";
import SuspendUsers from "./Admin/SuspendUsers";
import ManageUser from "./Admin/ManageUsers";
import Support from "./pages/Support";
import HallOfFame from "./pages/HallOfFame";
import PageNotFound from "./pages/PageNotFound";
import Community from "./pages/Community";
import Working from "./temp/Working";
import MandipBlog from "./Halloffame/Mandip/Bug"; // <-- Adjusted path
import Explore from "./pages/Explore"
import Notification from "./pages/Notification";
import HamNav from "./MobileLayouyt/HamNav"
import Create from "./MobileLayouyt/Create"
import TermAndCondition from "./pages/TermAndCondition";

import "./App.css";

function App() {
  const location = useLocation();

  // Pages where we hide header/navbar
  const hideLayout = [
    "/login",
    "/register",
    "/admin/login",
    "/messages",
    "/working",
    "/hall-of-fame/bounty/user/mandip",
    "/hall-of-fame",
  ].includes(location.pathname) || location.pathname.startsWith("/messages/");

  return (
    <div className="App flex flex-col min-h-screen relative text-black bg-white">
      {!hideLayout && (
        <>
          <div className="block md:hidden">
            <Header />
          </div>
          <div className="hidden md:block">
            <Navbar />
          </div>

        <div className="md:hidden">
          <MobileNavbar />
        </div>
        </>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<Messages />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/support" element={<Support />} />
          <Route path="/@:username" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/suspend" element={<SuspendUsers />} />
          <Route path="/admin/manage-users" element={<ManageUser />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/hall-of-fame/bounty/user/mandip" element={<MandipBlog />} />
          <Route path="/community" element={<Community />} />
          <Route path="/working" element={<Working />} />
           <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notification />} />
           <Route path="/create" element={<Create />} />
          <Route path="/hamvav" element={<HamNav />} />
           <Route path="/term-and-conditions" element={<TermAndCondition />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>


    </div>
  );
}

export default App;
