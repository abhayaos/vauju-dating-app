// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isTokenExpired } from "./utils/auth";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import Cookies from "js-cookie"; // 👈 Add this line

// Components
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Register from "./AUTH/Register";
import Login from "./AUTH/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import Matches from "./pages/Matches";
import Support from "./pages/SupportNew";
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
import Blogs from "./pages/Blogs";
import NameChanging from "./Blogs/NameChanging";
import BuyCoins from "./pages/BuyCoins";
import Friends from "./pages/Friends";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AuthConsumer({ children }) {
  const auth = useAuth();
  return children(auth);
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AuthConsumer>
      {({ token, logout }) => {
        useEffect(() => {
          const checkTokenExpiry = () => {
            // Check if token exists in context and is not expired
            if (token && isTokenExpired(token)) {
              logout();
              if (
                location.pathname !== "/login" &&
                location.pathname !== "/register"
              ) {
                navigate("/login", { replace: true });
              }
            }
          };

          checkTokenExpiry(); // immediate check
          const interval = setInterval(checkTokenExpiry, 60000);
          return () => clearInterval(interval);
        }, [token, navigate, location.pathname, logout]);

        const hideLayout =
          [
            "/login",
            "/register",
            "/working",
            "/hall-of-fame/bounty/user/mandip",
            "/hall-of-fame",
          ].includes(location.pathname) ||
          location.pathname.startsWith("/messages/");

        return (
          <div className="App flex flex-col min-h-screen relative text-black bg-white">

            <ScrollToTop />

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

            <main>
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
                <Route path="/hall-of-fame" element={<HallOfFame />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route
                  path="/hall-of-fame/bounty/user/mandip"
                  element={<MandipBlog />}
                />
                <Route path="/friends" element={<Friends />} />
                <Route path="/community" element={<Community />} />
                <Route path="/working" element={<Working />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/create" element={<Create />} />
                <Route path="/menu" element={<HamNav />} />
                <Route
                  path="/blog/how-tp-update-profile-in-aura-meet"
                  element={<NameChanging />}
                />
                <Route
                  path="/term-and-conditions"
                  element={<TermAndCondition />}
                />
                <Route path="/private-space" element={<PrivateSpeech />} />
                <Route path="/buy-coins" element={<BuyCoins />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
              <Analytics
                mode={
                  import.meta.env.MODE === "development"
                    ? "development"
                    : "production"
                }
                debug={false}
              />
            </main>
          </div>
        );
      }}
    </AuthConsumer>
  );
}

export default App;