// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isTokenExpired, clearAuthData } from "./utils/auth";
import { Analytics } from "@vercel/analytics/react"

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
import MandipBlog from "./Halloffame/Mandip/Bug";
import Explore from "./pages/Explore";
import Notification from "./pages/Notification";
import HamNav from "./MobileLayouyt/HamNav";
import Create from "./MobileLayouyt/Create";
import TermAndCondition from "./pages/TermAndCondition";
import PrivateSpeech from "./pages/PrivateSpeech";
import Blogs from "./pages/Blogs"; // <-- FIXED import
import NameChanging from "./Blogs/NameChanging"

import "./App.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Detect route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // loader lasts for 0.8s
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Check token expiry every 60 seconds and auto-logout if expired
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (isTokenExpired()) {
        clearAuthData();
        window.dispatchEvent(new Event("authChange"));
        if (location.pathname !== "/login" && location.pathname !== "/register") {
          navigate("/login", { replace: true });
        }
      }
    };

    checkTokenExpiry(); // Check immediately on mount
    const interval = setInterval(checkTokenExpiry, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  const hideLayout =
    [
      "/login",
      "/register",
      "/admin/login",
      "/working",
      "/hall-of-fame/bounty/user/mandip",
      "/hall-of-fame",
    ].includes(location.pathname) || location.pathname.startsWith("/messages/");

  return (
    <div className="App flex flex-col min-h-screen relative text-black bg-white">
      {/* 🔥 Top Loading Bar */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 z-[9999]"
          />
        )}
      </AnimatePresence>

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
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/@:username" element={<Profile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<Messages />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/suspend" element={<SuspendUsers />} />
          <Route path="/admin/users" element={<ManageUser />} />
          <Route path="/admin/manage-users" element={<ManageUser />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/blogs" element={<Blogs />} /> {/* <-- FIXED */}
          <Route
            path="/hall-of-fame/bounty/user/mandip"
            element={<MandipBlog />}
          />
          <Route path="/community" element={<Community />} />
          <Route path="/working" element={<Working />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/create" element={<Create />} />
          <Route path="/hamvav" element={<HamNav />} />
          <Route path="/blog/how-tp-update-profile-in-aura-meet" element={<NameChanging />} />
          <Route
            path="/term-and-conditions"
            element={<TermAndCondition />}
          />
          <Route path="/private-space" element={<PrivateSpeech />} />
          <Route path="*" element={<PageNotFound />} />
          <Analytics />
        </Routes>
      </main>
    </div>
  );
}

export default App;
