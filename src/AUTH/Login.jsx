import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock } from "lucide-react"; // Icons
import { io } from "socket.io-client"; // Socket.IO client

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("⚠️ Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://backend-vauju-1.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid credentials 😔");
        setLoading(false);
        return;
      }

      // ✅ Save JWT to localStorage
      localStorage.setItem("token", data.token); // make sure backend sends a token

      // ✅ Connect to Socket.IO
      const socket = io("https://backend-vauju-1.onrender.com");

      // Send JWT to server
      socket.emit("authenticate", data.token);

      // Listen for auth success/failure
      socket.on("authSuccess", (msg) => {
        toast.success(msg.message); // 🎉 JWT verified! You are now connected.
      });

      socket.on("authError", (msg) => {
        toast.error(msg.message); // ❌ Invalid token
      });

      window.dispatchEvent(new Event("authChange"));
      setTimeout(() => navigate("/profile"), 1500);
    } catch {
      toast.error("🚨 Server error! Try again later.");
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
            <Mail className="absolute left-3 top-3 text-gray-400" />
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
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
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
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
