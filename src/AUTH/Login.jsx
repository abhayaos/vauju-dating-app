import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { validateToken, decodeJWT } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidJWT = (token) => {
    if (!token || typeof token !== "string") return false;
    return token.split(".").length === 3;
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
      const res = await fetch(
        "https://backend-vauju-1.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.token || !isValidJWT(data.token) || !validateToken(data.token)) {
        toast.error(data.message || "🚨 Login failed!");
        return;
      }

      // Use AuthContext instead of localStorage
      login(data.token, data.user);

      toast.success("🎉 Login successful!");
      setTimeout(() => navigate("/", { replace: true }), 800);
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "🚨 Server error! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="rounded-3xl w-full max-w-md p-10 border border-gray-200">
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
