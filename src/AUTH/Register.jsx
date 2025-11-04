import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!emailRegex.test(email)) {
      toast.error("Invalid email! Only Gmail, Hotmail, Outlook allowed.");
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://backend-vauju-1.onrender.com/api/auth/register",
        { username, name, email, password }
      );

      // Use AuthContext instead of localStorage
      login(data.token, data.user);

      const socket = io("http://localhost:5000");
      socket.emit("authenticate", data.token);

      socket.on("authSuccess", (msg) => toast.success(msg.message));
      socket.on("authError", (msg) => toast.error(msg.message));

      toast.success("🎉 Registration successful!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      setErrors({ backend: error.response?.data?.message || "Registration failed!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {errors.backend && (
          <p className="text-red-600 text-center mb-4">{errors.backend}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="flex gap-3">
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
