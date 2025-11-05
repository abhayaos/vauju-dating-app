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
import PWAInstaller from "./components/PWAInstaller"; // 👈 Add this line

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
  const [needRefresh, setNeedRefresh] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSW, setUpdateSW] = useState(null);



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
            const cookieToken = Cookies.get("token"); // 👈 Get latest token from cookie

            // if token in cookie differs from context OR is expired
            if (!cookieToken || isTokenExpired(cookieToken)) {
              logout();
              Cookies.remove("token"); // 👈 Clear invalid cookie automatically
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
            {/* PWA Update Notification */}
            {needRefresh && (
              <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 z-[9999] shadow-lg">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">New version available!</span>
                  </div>
                  <div className="flex gap-2">
                    {isUpdating ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => window.location.reload()}
                          className="bg-white text-blue-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Reload
                        </button>
                        <button
                          onClick={updateApp}
                          className="bg-white text-blue-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Update Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

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
            
            {/* PWA Installer */}
            <PWAInstaller />
          </div>
        );
      }}
    </AuthConsumer>
  );
}

export default App;