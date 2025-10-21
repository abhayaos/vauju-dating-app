import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { validateToken, decodeJWT } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Basic JWT format validation
  const isValidJWT = (token) => {
    if (!token || typeof token !== "string") return false;
    const parts = token.split(".");
    return parts.length === 3; // JWT should have header, payload, signature
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("⚠️ Please fill in all fields!");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      toast.error("⚠️ Please enter a valid email address!");
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("⚠️ Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      const payload = { email: trimmedEmail, password: trimmedPassword };
      console.log("Sending login request with payload:", payload); // Debug payload

      const res = await fetch("https://backend-vauju-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Login response:", { status: res.status, data }); // Debug response

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials 😔");
        throw new Error(`Login failed: ${data.message || "Unknown error"}`);
      }

      if (!data.token) {
        toast.error("🚨 Login failed: No token received!");
        throw new Error("No token in response");
      }

      if (!isValidJWT(data.token)) {
        toast.error("🚨 Invalid token format received!");
        throw new Error("Invalid JWT format");
      }

      // Validate token before storing
      if (!validateToken(data.token)) {
        toast.error("🚨 Received invalid or expired token!");
        throw new Error("Invalid token from server");
      }

      // Try to decode and log token details
      const tokenPayload = decodeJWT(data.token);
      if (!tokenPayload) {
        toast.error("🚨 Could not decode token!");
        throw new Error("Token decode failed");
      }

      localStorage.setItem("token", data.token);
      console.log("Token stored successfully:", {
        token: data.token.substring(0, 50) + "...",
        payload: tokenPayload,
        expires: tokenPayload.exp ? new Date(tokenPayload.exp * 1000) : "No expiration"
      });
      
      // Store user data if available
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("User data stored:", data.user);
      }

      toast.success("🎉 Login successful!");
      window.dispatchEvent(new Event("authChange"));
      
      // Navigate after short delay
      setTimeout(() => {
        console.log("Navigating to profile...");
        navigate("/profile", { replace: true });
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "🚨 Server error! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-md p-10 border border-gray-200">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center tracking-tight">
          AuraMeet
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Log in to connect with People with Auraa 💖
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transform transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;