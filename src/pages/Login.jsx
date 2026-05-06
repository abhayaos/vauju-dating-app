import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      login({ email: data.user.email, fullName: data.user.fullName, token: data.token, _id: data.user.id });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="absolute w-72 h-72 bg-blue-100 rounded-full blur-3xl top-10 left-10 opacity-60 pointer-events-none" />
      <div className="absolute w-72 h-72 bg-purple-100 rounded-full blur-3xl bottom-10 right-10 opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Welcome back</h1>
        <p className="text-center text-gray-500 mt-2">Sign in to continue</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
              placeholder="you@example.com"
              className={`w-full mt-2 px-4 py-3 rounded-xl border transition outline-none ${focused === "email" ? "border-blue-500 shadow-md" : "border-gray-300"}`}
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("pass")}
              onBlur={() => setFocused("")}
              placeholder="••••••••"
              className={`w-full mt-2 px-4 py-3 rounded-xl border transition outline-none ${focused === "pass" ? "border-blue-500 shadow-md" : "border-gray-300"}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-10 text-sm text-gray-500 hover:text-gray-800"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:scale-[1.02] active:scale-95 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="text-black font-medium cursor-pointer hover:underline">
            Create account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
