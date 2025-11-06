// src/App.jsx
import React, { useEffect, useState, useCallback, Suspense } from "react";
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

// Loading Component
const LoadingFallback = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center justify-center min-h-screen"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
  </motion.div>
);

// Lazy load routes - reduces initial bundle size
const Home = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/Home"));
const Register = React.lazy(() => import(/* webpackChunkName: "auth" */ "./AUTH/Register"));
const Login = React.lazy(() => import(/* webpackChunkName: "auth" */ "./AUTH/Login"));
const Profile = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/Profile"));
const EditProfile = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/EditProfile"));
const Messages = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/Messages"));
const Matches = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/Matches"));
const Support = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/SupportNew"));
const HallOfFame = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/HallOfFame"));
const PageNotFound = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/PageNotFound"));
const Community = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/Community"));
const Working = React.lazy(() => import(/* webpackChunkName: "temp" */ "./temp/Working"));
const MandipBlog = React.lazy(() => import(/* webpackChunkName: "blogs" */ "./Halloffame/Mandip/Bug"));
const Explore = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/Explore"));
const Notification = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/Notification"));
const HamNav = React.lazy(() => import(/* webpackChunkName: "mobile" */ "./MobileLayouyt/HamNav"));
const Create = React.lazy(() => import(/* webpackChunkName: "mobile" */ "./MobileLayouyt/Create"));
const TermAndCondition = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/TermAndCondition"));
const PrivateSpeech = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/PrivateSpeech"));
const Blogs = React.lazy(() => import(/* webpackChunkName: "blogs" */ "./pages/Blogs"));
const NameChanging = React.lazy(() => import(/* webpackChunkName: "blogs" */ "./Blogs/NameChanging"));
const BuyCoins = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/BuyCoins"));
const Friends = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/Friends"));

import "./App.css";

// Create a lazy-loaded PostDetail component
const PostDetail = React.lazy(() => import(/* webpackChunkName: "pages" */ "./pages/PostDetail"));

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
              <Suspense fallback={<LoadingFallback />}>
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
                  {/* Add route for individual posts */}
                  <Route path="/posts/:postId" element={<PostDetail />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Suspense>
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