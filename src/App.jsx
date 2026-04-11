import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import MainLayout from "./layouts/MainLayout";
import PageNotFound from "./routes/PageNotFound";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes (blocked if logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Protected Routes (only if logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;