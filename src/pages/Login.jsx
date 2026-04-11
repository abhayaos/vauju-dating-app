import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  // 🔥 REAL API LOGIN (replaces setTimeout fake login)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 💾 SAVE USER (this works with persistent auth context)
      login({
        email: data.user.email,
        fullName: data.user.fullName,
        token: data.token,
      });

      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">

      {/* Floating soft background blur */}
      <div className="absolute w-72 h-72 bg-blue-100 rounded-full blur-3xl top-10 left-10 opacity-60"></div>
      <div className="absolute w-72 h-72 bg-purple-100 rounded-full blur-3xl bottom-10 right-10 opacity-60"></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Welcome back
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Sign in to continue
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">

          {/* Email */}
          <div className="relative">
            <label className="text-sm text-gray-600">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              placeholder="you@example.com"
              className={`w-full mt-2 px-4 py-3 rounded-xl border transition outline-none
              ${
                focused === "email"
                  ? "border-blue-500 shadow-md"
                  : "border-gray-300"
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-gray-600">Password</label>

            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("pass")}
              onBlur={() => setFocused("")}
              placeholder="••••••••"
              className={`w-full mt-2 px-4 py-3 rounded-xl border transition outline-none
              ${
                focused === "pass"
                  ? "border-blue-500 shadow-md"
                  : "border-gray-300"
              }`}
              required
            />

            {/* toggle */}
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-10 text-sm text-gray-500 hover:text-gray-800"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-blue-600" />
              Remember me
            </label>

            <span className="text-blue-600 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:scale-[1.02] active:scale-95 transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={handleSignup}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;